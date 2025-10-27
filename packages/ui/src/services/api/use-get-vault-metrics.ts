import envParsed from "@/envParsed";
import { getNetworkConfig } from "@/shared/config/network";
import { useQuery } from "@tanstack/react-query";
import { computeVaultMetricsByVaultId } from "./lib/vault-metrics";
import { VaultMetricsResponse } from "./types/vault-data";


async function getVaultMetrics() {
  const network = getNetworkConfig().chain;
  const { API_GATEWAY } = envParsed();

  const snapshotsResponse = await fetch(
    `${API_GATEWAY}/lagoon/snapshots/test?offset=0&limit=100&chain_id=${network.id}`,
  );
  if (!snapshotsResponse.ok) throw new Error("Failed to fetch vault data");

  const snapshotsData = await snapshotsResponse.json();
  const vaultMetrics = computeVaultMetricsByVaultId(snapshotsData);

  return vaultMetrics;
}

type VaultMetrics = {
  id: string;
  netApy: number;
  netApy30d: number;
  sharpe: number;
};


function convertToVaultMetricsData(
  initialVaultMetricsData: VaultMetricsResponse[]
): VaultMetrics[] {

  return initialVaultMetricsData.map((vaultMetrics) => {
    return {
      id: vaultMetrics.vaultId,
      netApy: vaultMetrics.netApy || 0,
      netApy30d: vaultMetrics.netApy30d || 0,
      sharpe: vaultMetrics.sharpe || 0,
    } satisfies VaultMetrics;
  });
}


export function useGetVaultMetrics() {
  const { data: vaultMetricsData, ...rest } = useQuery<VaultMetrics[]>({
    queryKey: ["get-vault-metrics"],
    queryFn: async () => {
      const vaultMetrics = await getVaultMetrics();
      return convertToVaultMetricsData(vaultMetrics);
    },
  });


  const hasVaultMetrics = vaultMetricsData && vaultMetricsData.length > 0;

  return { vaultMetricsData, hasVaultMetrics, ...rest };
}