import envParsed from "@/envParsed";
import { getNetworkConfig } from "@/shared/config/network";
import { useQuery } from "@tanstack/react-query";
import { isAddress } from "viem";
import { Vault } from "@/shared/types";
import { convertVaultToVaultData } from "../shared/transformers/vaults";
import { GetVaultResponse } from "./types/vault";

async function getVaultById(wallet: string, vaultId: string) {
  const network = getNetworkConfig().chain;
  const { API_GATEWAY } = envParsed();
  const integratedPositionResponse = await fetch(
    `${API_GATEWAY}/lagoon/integrated/test/${wallet}?offset=0&limit=10&chain_id=${network.id}`,
  );
  if (!integratedPositionResponse.ok) throw new Error("Failed to fetch vault data");
  const vaults = await integratedPositionResponse.json();
  return vaults.positions.find((p: GetVaultResponse) => p.vault_id === vaultId);
}

export function useGetVaultById(wallet: string, vaultId: string) {
  const { data: vault, ...rest } = useQuery<Vault>({
    queryKey: ["get-vault-by-id", wallet, vaultId],
    queryFn: async () => {
      const vault = await getVaultById(wallet, vaultId);
      return convertVaultToVaultData(vault);
    },
    enabled: isAddress(wallet) || wallet === "0x",
  });

  return { vault, ...rest };
}
