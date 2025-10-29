import { useSession } from "@/context/session-context";
import { useVaults } from "@/context/vault-context";
import IERC20ABI from "@/services/lagoon/abis/IERC20.json";
import { publicClient } from "@/services/viem/viem";
import { POLL_VAULTS_DATA_BALANCES_INTERVAL } from "@/shared/config/constants";
import { getNetworkConfig } from "@/shared/config/network";
import { formatToMaxDefinition } from "@/shared/utils";
import { useQuery } from "@tanstack/react-query";
import { Abi, Address, formatUnits, isAddress, MulticallParameters } from "viem";

export interface TokensBalance {
  [vaultId: string]: {
    availableSupply: string;
  };
}

export function useTokensBalance(pollInterval: number) {
  const { vaults } = useVaults(POLL_VAULTS_DATA_BALANCES_INTERVAL);
  const { evmAddress } = useSession();
  const chain = getNetworkConfig().chain;

  return useQuery<TokensBalance>({
    queryKey: ["tokensBalances", evmAddress, chain.id],
    queryFn: async () => {
      if (!evmAddress || !chain.id || !publicClient || !vaults) {
        throw new Error("Missing required data for tokens balances");
      }

      try {
        const result: TokensBalance = {};

        const queryLength = 1; // Number of queries per vault

        const contracts: MulticallParameters["contracts"] = vaults.vaultsData.flatMap((vault) => [
          {
            address: vault.staticData.token_address as Address,
            abi: IERC20ABI as Abi,
            functionName: "balanceOf",
            args: [evmAddress as Address],
          },
        ]);

        const results = await publicClient.multicall({
          contracts,
          allowFailure: false,
        });

        vaults.vaultsData.forEach((v, i) => {
          const availableSupply = results[i * queryLength] as bigint;
          result[v.staticData.vault_id] = {
            availableSupply: formatToMaxDefinition(
              Number(formatUnits(availableSupply, v.staticData.token_decimals)),
            ).toString(),
          };
        });

        return result;
      } catch (error) {
        console.error("Error fetching tokens balances:", error);
        return {};
      }
    },
    enabled: isAddress(evmAddress) && localStorage.getItem("disconnect_requested") !== "true", // Don't poll if disconnect was requested
    staleTime: 1000 * 30, // 30 seconds
    //refetchInterval: 60 * 1000, // Poll every minute
    refetchInterval: pollInterval,
    refetchIntervalInBackground: true,
  });
}
