import { useSession } from "@/context/session-context";
import { useVaults } from "@/context/vault-context";
import { publicClient } from "@/services/viem/viem";
import { getNetworkConfig } from "@/shared/config/network";
import { formatToFourDecimals } from "@/shared/utils";
import { useQuery } from "@tanstack/react-query";
import { Abi, Address, formatUnits, isAddress, MulticallParameters } from "viem";
import IERC20ABI from "../lagoon/abis/IERC20.json";
import VaultABI from "../lagoon/abis/Vault.json";

export interface TokensBalance {
  nativeBalance: string;
  vaultBalances: {
    [vaultId: string]: {
      availableSupply: string;
      shares: string;
    };
  };
}

export function useTokensBalance() {
  const { vaults } = useVaults();
  const { evmAddress } = useSession();
  const chain = getNetworkConfig().chain;

  return useQuery<TokensBalance>({
    queryKey: ["tokensBalances", evmAddress, chain.id],
    queryFn: async () => {
      if (!evmAddress || !chain.id || !publicClient || !vaults) {
        throw new Error("Missing required data for tokens balances");
      }

      try {
        const result: TokensBalance = {
          nativeBalance: "0",
          vaultBalances: {},
        };

        /* if (isUnderlyingWrapNative) {
          const balanceNative = await getEthersProvider().getBalance(safeAddress);
          result.nativeBalance = formatUnits(balanceNative.toBigInt(), 18).substring(0, 8);
        } */

        const contracts: MulticallParameters["contracts"] = vaults.vaultsData.flatMap((vault) => [
          {
            address: vault.staticData.token_address as Address,
            abi: IERC20ABI as Abi,
            functionName: "balanceOf",
            args: [evmAddress as Address],
          },
          {
            address: vault.staticData.vault_address as Address,
            abi: VaultABI as Abi,
            functionName: "balanceOf",
            args: [evmAddress as Address],
          },
        ]);

        const results = await publicClient.multicall({
          contracts,
          allowFailure: false,
        });

        vaults.vaultsData.forEach((v, i) => {
          const availableSupply = results[i * 2] as bigint;
          const shares = results[i * 2 + 1] as bigint;

          result.vaultBalances[v.staticData.vault_id.toString()] = {
            availableSupply: formatToFourDecimals(
              Number(formatUnits(availableSupply, v.staticData.token_decimals)),
            ).toString(),
            shares: formatToFourDecimals(
              Number(formatUnits(shares, v.staticData.vault_decimals)),
            ).toString(),
          };
        });

        return result;
      } catch (error) {
        console.error("Error fetching tokens balances:", error);
        return {
          nativeBalance: "0",
          vaultBalances: {},
        };
      }
    },
    enabled: isAddress(evmAddress) && localStorage.getItem("disconnect_requested") !== "true", // Don't poll if disconnect was requested
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 5000, // Poll every 5 seconds
    refetchIntervalInBackground: true,
  });
}
