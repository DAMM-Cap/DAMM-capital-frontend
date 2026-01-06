import envParsed from "@/envParsed";
import { useQuery } from "@tanstack/react-query";

export interface RiskDisclosureItem {
  title: string;
  description: string;
}

export interface RiskDisclosure {
  intro: string;
  items: RiskDisclosureItem[];
}

export interface VaultMetadata {
  thesis: string[];
  goals: string[];
  overview: string;
  riskDisclosure: RiskDisclosure;
  settlementFrequency?: string; // Optional field for settlement frequency
  structure: {
    mother: string; // Mother vault address (always present)
    children: string[]; // Always an array (empty if no children)
  };
}

export interface VaultMetadataResponse {
  vault_id: string;
  vault_address: string;
  chain_id: number;
  metadata: VaultMetadata | null;
  created_at: string | null;
  updated_at: string | null;
}

export function useVaultMetadata(vaultId: string | undefined) {
  return useQuery<VaultMetadataResponse>({
    queryKey: ["vaultMetadata", vaultId],
    queryFn: async ({ signal }) => {
      if (!vaultId) {
        throw new Error("Vault ID is required");
      }
      const { API_GATEWAY } = envParsed();
      const res = await fetch(`${API_GATEWAY}/lagoon/vault-metadata/test/${vaultId}`, {
        signal,
      });
      if (!res.ok) throw new Error("Network error");
      return await res.json();
    },
    enabled: !!vaultId,
    staleTime: 5 * 60 * 1000, // 5 minutes - metadata doesn't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

