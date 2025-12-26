import envParsed from "@/envParsed";
import { getNetworkConfig } from "./network";
import { VaultMetadataResponse } from "@/services/api/use-vault-metadata";

/**
 * Get Octav link for a vault using metadata.
 * 
 * @param vaultMetadata - Vault metadata response containing structure with mother and children addresses
 * @returns Octav link with addresses if structure.mother exists, otherwise base URL
 */
export function getOctavLinkFromMetadata(
  vaultMetadata: VaultMetadataResponse | undefined | null
): string {
  const { OCTAV_GATEWAY } = envParsed();
  
  // Access mother and children from nested structure
  const motherAddress = vaultMetadata?.metadata?.structure?.mother;
  
  // Only build Octav link with addresses if mother exists in metadata.structure
  if (motherAddress) {
    let octavLink = `${OCTAV_GATEWAY}/?addresses=${motherAddress}`;
    
    // Add children addresses if any exist
    const children = vaultMetadata.metadata?.structure?.children;
    if (children && children.length > 0) {
      octavLink = octavLink + children.map((child) => `,${child}`).join("");
    }
    
    return octavLink;
  }
  
  // Fallback to base URL if no structure.mother in metadata
  return OCTAV_GATEWAY;
}

/**
 * Get Kleros Curate link for a vault using metadata.
 * 
 * @param vaultMetadata - Vault metadata response containing vault address
 * @param vaultAddress - Vault address (used as fallback if metadata is incomplete)
 * @returns Kleros Curate link with chain ID and vault address
 */
export function getCurateLinkFromMetadata(
  vaultMetadata: VaultMetadataResponse | undefined | null,
  vaultAddress: string
): string {
  const chainId = getNetworkConfig().chain.id;
  const { CURATE_GATEWAY } = envParsed();
  
  const address = vaultMetadata?.vault_address || vaultAddress;
  return `${CURATE_GATEWAY}/tcr/${chainId}/${address}`;
}

/**
 * Get Octav and Kleros Curate links for a vault using metadata.
 * 
 * @deprecated Use getOctavLinkFromMetadata and getCurateLinkFromMetadata instead.
 * This function is kept for backward compatibility.
 * 
 * @param vaultMetadata - Vault metadata response containing mother and children addresses
 * @param vaultAddress - Vault address (used for curate link if metadata is incomplete)
 * @returns Object with octavLink and curateLink
 */
export function getVaultLinksFromMetadata(
  vaultMetadata: VaultMetadataResponse | undefined | null,
  vaultAddress: string
): { octavLink: string; curateLink: string } {
  return {
    octavLink: getOctavLinkFromMetadata(vaultMetadata),
    curateLink: getCurateLinkFromMetadata(vaultMetadata, vaultAddress),
  };
}
