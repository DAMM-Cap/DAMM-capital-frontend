import { useSession } from "@/context/session-context";
import { useVaults } from "@/context/vault-context";
import { publicClient } from "@/services/viem/viem";
import { getNetworkConfig } from "@/shared/config/network";
import { formatToMaxDefinition } from "@/shared/utils";
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
      assets: string;
      sharePrice: string;
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

        const queryLength = 4; // Number of queries per vault

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
          {
            address: vault.staticData.vault_address as Address,
            abi: VaultABI as Abi,
            functionName: "claimableDepositRequest",
            args: [0, evmAddress as Address],
          },
          {
            address: vault.staticData.vault_address as Address,
            abi: VaultABI as Abi,
            functionName: "pendingRedeemRequest",
            args: [0, evmAddress as Address],
          },
        ]);

        const results = await publicClient.multicall({
          contracts,
          allowFailure: false,
        });

        const conversionArrayLength = 3; // Number of conversion queries per vault

        const resultsAssets = await publicClient.multicall({
          contracts: vaults.vaultsData.flatMap((vault, i) => [
            {
              address: vault.staticData.vault_address as Address,
              abi: VaultABI as Abi,
              functionName: "convertToAssets",
              args: [results[i * queryLength + 1] as bigint],
            },
            {
              address: vault.staticData.vault_address as Address,
              abi: VaultABI as Abi,
              functionName: "convertToShares",
              args: [results[i * queryLength + 2] as bigint],
            },
            {
              address: vault.staticData.vault_address as Address,
              abi: VaultABI as Abi,
              functionName: "convertToAssets",
              args: [results[i * queryLength + 3] as bigint],
            },
          ]) as MulticallParameters["contracts"],
          allowFailure: false,
        });

        vaults.vaultsData.forEach((v, i) => {
          const availableSupply = results[i * queryLength] as bigint;
          const shares =
            BigInt(results[i * queryLength + 1] as bigint) +
            BigInt(resultsAssets[i * conversionArrayLength + 1] as bigint) +
            BigInt(results[i * queryLength + 3] as bigint);
          const assets =
            BigInt(resultsAssets[i * conversionArrayLength] as bigint) +
            BigInt(results[i * queryLength + 2] as bigint) +
            BigInt(resultsAssets[i * conversionArrayLength + 2] as bigint);
          const sharePrice = shares > 0n 
            ? (assets * BigInt(10 ** v.staticData.vault_decimals)) / shares
            : 0n;

          result.vaultBalances[v.staticData.vault_id.toString()] = {
            availableSupply: formatToMaxDefinition(
              Number(formatUnits(availableSupply, v.staticData.token_decimals)),
            ).toString(),
            shares: formatToMaxDefinition(
              Number(formatUnits(shares, v.staticData.vault_decimals)),
            ).toString(),
            assets: formatToMaxDefinition(
              Number(formatUnits(assets, v.staticData.token_decimals)),
            ).toString(),
            sharePrice: formatUnits(sharePrice, v.staticData.token_decimals),
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
    refetchInterval: 60 * 1000, // Poll every minute
    refetchIntervalInBackground: true,
  });
}
