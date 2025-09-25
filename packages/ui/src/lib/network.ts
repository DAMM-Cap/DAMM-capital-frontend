import { NetworkConfig } from "@/lib/types/network";
import { base, baseSepolia, sepolia } from "viem/chains";

export const getNetworkConfig = (): NetworkConfig => {
  if (process.env.USE_MAINNET === "true") {
    baseNetworkConfig.rpcUrl = process.env.BASE_NODE_URL || "https://base.drpc.org";
    return baseNetworkConfig;
  }

  baseSepoliaNetworkConfig.rpcUrl =
    process.env.BASE_NODE_URL || "https://base-sepolia-rpc.publicnode.com";
  return baseSepoliaNetworkConfig;
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
