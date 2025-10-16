import envParsed from "@/envParsed";
import { optimism, sepolia } from "viem/chains";

import { ethereumChainLogo, optimismChainLogo } from "@/components/token-icons";
import type { Chain } from "viem";

export type NetworkConfig = {
  chain: Chain;
  rpcUrl?: string;
  network: "ethereum-sepolia" | "optimism";
  explorerUrl: string;
};

export const getNetworkConfig = (): NetworkConfig => {
  const { USE_SEPOLIA, SEPOLIA_NODE_URL, OPTIMISM_NODE_URL } = envParsed();

  if (USE_SEPOLIA === "true") {
    sepoliaNetworkConfig.rpcUrl = SEPOLIA_NODE_URL || "https://sepolia.gateway.tenderly.co";
    return sepoliaNetworkConfig;
  }

  optimismNetworkConfig.rpcUrl = OPTIMISM_NODE_URL || "https://gateway.tenderly.co/public/optimism";
  return optimismNetworkConfig;
};

const optimismNetworkConfig: NetworkConfig = {
  chain: optimism,
  network: "optimism",
  explorerUrl: "https://optimistic.etherscan.io",
};

const sepoliaNetworkConfig: NetworkConfig = {
  chain: sepolia,
  network: "ethereum-sepolia",
  explorerUrl: "https://sepolia.etherscan.io",
};

export const getChainLogo = (chain: Chain) => {
  if (chain.id === 10) return optimismChainLogo;
  if (chain.id === 11155111) return ethereumChainLogo;
  return optimismChainLogo;
};

export const getShortAddress = (address: string) => {
  return address?.slice(0, 6).concat("...").concat(address?.slice(-4));
};
