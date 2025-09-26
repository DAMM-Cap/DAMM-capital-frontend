import envParsed from "@/envParsed";
import { base, baseSepolia, sepolia } from "viem/chains";

import type { Chain } from "viem";

export type NetworkConfig = {
  chain: Chain;
  rpcUrl?: string;
  network: "base" | "base-sepolia" | "ethereum-sepolia";
  explorerUrl: string;
};

export const getNetworkConfig = (): NetworkConfig => {
  const { USE_MAINNET, USE_SEPOLIA, BASE_NODE_URL, SEPOLIA_NODE_URL } = envParsed();

  if (USE_MAINNET === "true") {
    baseNetworkConfig.rpcUrl = BASE_NODE_URL || "https://base.drpc.org";
    return baseNetworkConfig;
  }

  if (USE_SEPOLIA === "true") {
    sepoliaNetworkConfig.rpcUrl = SEPOLIA_NODE_URL || "https://sepolia.gateway.tenderly.co";
    return sepoliaNetworkConfig;
  }

  baseSepoliaNetworkConfig.rpcUrl = BASE_NODE_URL || "https://base-sepolia-rpc.publicnode.com";
  return baseSepoliaNetworkConfig;
};

const sepoliaNetworkConfig: NetworkConfig = {
  chain: sepolia,
  network: "ethereum-sepolia",
  explorerUrl: "https://sepolia.etherscan.io",
};

const baseSepoliaNetworkConfig: NetworkConfig = {
  chain: baseSepolia,
  network: "base-sepolia",
  explorerUrl: "https://sepolia.basescan.org",
};

const baseNetworkConfig: NetworkConfig = {
  chain: base,
  network: "base",
  explorerUrl: "https://basescan.org",
};
