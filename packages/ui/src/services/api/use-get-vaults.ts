import envParsed from "@/envParsed";
import { getNetworkConfig } from "@/shared/config/network";
import { useQuery } from "@tanstack/react-query";
import { isAddress } from "viem";
import { Vault } from "@/shared/types";
import { convertVaultsToVaultsData } from "../shared/transformers/vaults";

async function getVaults(wallet: string) {
  const network = getNetworkConfig().chain;
  const { API_GATEWAY } = envParsed();
  const integratedPositionResponse = await fetch(
    `${API_GATEWAY}/lagoon/integrated/test/${wallet}?offset=0&limit=10&chain_id=${network.id}`,
  );
  if (!integratedPositionResponse.ok) throw new Error("Failed to fetch vault data");
  return integratedPositionResponse.json();
}

export function useGetVaults(wallet: string) {
  const { data: vaults, ...rest } = useQuery<Vault[]>({
    queryKey: ["get-vaults"],
    queryFn: async () => {
      const vaults = await getVaults(wallet);
      return convertVaultsToVaultsData(vaults.positions);
    },
    enabled: isAddress(wallet) || wallet === "0x",
  });

  const hasVaults = vaults && vaults.length > 0;

  return { vaults, hasVaults, ...rest };
}
