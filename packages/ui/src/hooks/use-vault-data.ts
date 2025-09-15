import {
  convertIntegratedPosition,
  getNullMockedIntegratedPosition,
  IntegratedPosition,
} from "@/lib/data/integrated-position-converter";
import { getNullMockedVaultData } from "@/lib/data/mocks";
import { IntegratedDataResponse, VaultDataResponse } from "@/lib/data/types/vault-data";
import { getNetworkConfig } from "@/lib/network";
import { useQuery } from "@tanstack/react-query";

export function useVaultData(wallet: string) {
  //const { getVaultDataDirectly } = useGetVaultDataDirectly();
  const network = getNetworkConfig().chain;

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
          `${
            import.meta.env.VITE_API_GATEWAY
          }/lagoon/integrated/test/${wallet}?offset=0&limit=10&chain_id=${network.id}`,
        );
        if (!integratedPositionResponse.ok) throw new Error("Failed to fetch vault data");

        let vaultData = await integratedPositionResponse.json();
        vaultData.positions.forEach((p: IntegratedPosition, i: number) => {
          p.token_symbol = `${p.token_symbol}(${i + 1})`;
        });
        if (vaultData.positions.length === 0) {
          console.warn("No positions found");
          vaultData = getNullMockedIntegratedPosition();
        }

        const integratedPositionData: IntegratedDataResponse[] =
          convertIntegratedPosition(vaultData);

        const data: VaultDataResponse = {
          vaultsData: integratedPositionData,
        };

        return data;
      } catch (error) {
        console.warn("Error fetching vault data:", error);
        console.warn("Retrieving vault data from contract");
        return getNullMockedVaultData();
        //return await getVaultDataDirectly();
      }
    },
    enabled:
      typeof wallet === "string" &&
      wallet.length > 0 &&
      wallet.trim() !== "" &&
      wallet.startsWith("0x") &&
      localStorage.getItem("disconnect_requested") !== "true", // Don't poll if disconnect was requested
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 5000, // Poll every 5 seconds
    refetchIntervalInBackground: true,
  });
}
