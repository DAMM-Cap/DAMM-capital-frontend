import envParsed from "@/envParsed";
import vaultsMother from "@/shared/config/vaults-mothers.json";
import { getNetworkConfig } from "./network";

export function getVaultLinks(vaultAddress: string): { octavLink: string; curateLink: string } {
  const chainId = getNetworkConfig().chain.id;
  const { OCTAV_GATEWAY, CURATE_GATEWAY } = envParsed();
  const vaults = vaultsMother.vaults;
  // Make comparison case-insensitive
  const vault = vaults.find((v) => v.vault.toLowerCase() === vaultAddress.toLowerCase());
  if (!vault) {
    return {
      octavLink: OCTAV_GATEWAY,
      curateLink: CURATE_GATEWAY + `/tcr/${chainId}/${vaultAddress}`,
    };
  }
  let octavLink = `${OCTAV_GATEWAY}/?addresses=${vault?.mother}`;
  const curateLink = `${CURATE_GATEWAY}/tcr/${chainId}/${vault?.vault}`;

  octavLink = octavLink + vault?.children.map((child) => `,${child}`).join("");
  return {
    octavLink,
    curateLink,
  };
}
