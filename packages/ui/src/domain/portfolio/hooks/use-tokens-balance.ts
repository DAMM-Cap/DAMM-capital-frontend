import { useSession } from "@/context/session-context";
import { useVaults } from "@/context/vault-context";
import VaultABI from "@/services/lagoon/abis/Vault.json";
import { publicClient } from "@/services/viem/viem";
import { POLL_VAULTS_DATA_BALANCES_INTERVAL } from "@/shared/config/constants";
import { getNetworkConfig } from "@/shared/config/network";
import { formatToMaxDefinition } from "@/shared/utils";
import { useQuery } from "@tanstack/react-query";
import { Abi, Address, formatUnits, isAddress, MulticallParameters } from "viem";

export interface TokensBalance {
  [vaultId: string]: {
    assets: string;
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

        const queryLength = 3; // Number of queries per vault

        const contracts: MulticallParameters["contracts"] = vaults.vaultsData.flatMap((vault) => [
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

        const conversionArrayLength = 2; // Number of conversion queries per vault

        const resultsAssets = await publicClient.multicall({
          contracts: vaults.vaultsData.flatMap((vault, i) => [
            {
              address: vault.staticData.vault_address as Address,
              abi: VaultABI as Abi,
              functionName: "convertToAssets",
              args: [results[i * queryLength] as bigint],
            },
            {
              address: vault.staticData.vault_address as Address,
              abi: VaultABI as Abi,
              functionName: "convertToAssets",
              args: [results[i * queryLength + 2] as bigint],
            },
          ]) as MulticallParameters["contracts"],
          allowFailure: false,
        });

        vaults.vaultsData.forEach((v, i) => {
          const assets =
            BigInt(resultsAssets[i * conversionArrayLength] as bigint) +
            BigInt(results[i * queryLength + 1] as bigint) +
            BigInt(resultsAssets[i * conversionArrayLength + 1] as bigint);
          result[v.staticData.vault_id] = {
            assets: formatToMaxDefinition(
              Number(formatUnits(assets, v.staticData.token_decimals)),
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
    //staleTime: 1000 * 30, // 30 seconds
    staleTime: 1000 * 60 * 5, // 5 minutes
    //refetchInterval: 60 * 1000, // Poll every minute
    refetchInterval: pollInterval,
    refetchIntervalInBackground: true,
    refetchOnMount: "always",
  });
}
