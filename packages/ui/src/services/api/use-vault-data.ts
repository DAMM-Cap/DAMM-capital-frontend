import envParsed from "@/envParsed";
import {
  convertIntegratedPosition,
  getNullMockedIntegratedPosition,
} from "@/services/api/lib/integrated-position-converter";
import { getNullMockedVaultData } from "@/services/api/lib/mock-data/mocks";
import { IntegratedDataResponse, VaultDataResponse } from "@/services/api/types/vault-data";
import { getNetworkConfig } from "@/shared/config/network";
import { useQuery } from "@tanstack/react-query";
import { isAddress } from "viem";
import { tokenSymbolsWithSuffix } from "./lib/utils";
import { computeVaultMetricsByVaultId } from "./lib/vault-metrics";

export function useVaultData(wallet: string, pollInterval: number) {
  const network = getNetworkConfig().chain;
  const { API_GATEWAY } = envParsed();

  return useQuery<VaultDataResponse>({
    queryKey: ["vaultData", wallet],
    queryFn: async () => {
      if (typeof wallet !== "string" || wallet.trim() === "") {
        console.warn("No wallet address provided");
        return getNullMockedVaultData();
      }
      try {
        //throw new Error("test");

        const integratedPositionResponse = await fetch(
          `${API_GATEWAY}/lagoon/integrated/test/${wallet}?offset=0&limit=10&chain_id=${network.id}`,
        );
        if (!integratedPositionResponse.ok) throw new Error("Failed to fetch vault data");

        let vaultData = await integratedPositionResponse.json();
        
        // Here we modify the token symbols in case we have several vaults with the same underlying token
        tokenSymbolsWithSuffix(vaultData.positions); 

        if (vaultData.positions.length === 0) {
          console.warn("No positions found");
          vaultData = getNullMockedIntegratedPosition();
        }

        const integratedPositionData: IntegratedDataResponse[] =
          convertIntegratedPosition(vaultData);

        const data: VaultDataResponse = {
          vaultsData: integratedPositionData,
          vaultMetrics: [],
        };

        const snapshotsResponse = await fetch(
          `${API_GATEWAY}/lagoon/snapshots/test?offset=0&limit=100&chain_id=${network.id}`,
        );
        if (!snapshotsResponse.ok) throw new Error("Failed to fetch vault data");

        const snapshotsData = await snapshotsResponse.json();
        const vaultMetrics = computeVaultMetricsByVaultId(snapshotsData);

        data.vaultMetrics = vaultMetrics;

        return data;
      } catch (error) {
        console.warn("Error fetching vault data:", error);
        console.warn("Retrieving vault data from contract");
        return getNullMockedVaultData();
      }
    },
    enabled:
      // When wallet is 0x the user is not connected but we still want to get the funds data
      // When wallet is not 0x the connected wallet is validated before fetching the data
      (isAddress(wallet) || wallet === "0x") &&
      localStorage.getItem("disconnect_requested") !== "true", // Don't poll if disconnect was requested
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: pollInterval,
    refetchIntervalInBackground: false,
    refetchOnMount: "always",
  });
}
