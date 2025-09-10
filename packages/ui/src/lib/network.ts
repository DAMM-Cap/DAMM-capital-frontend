import { NetworkConfig } from "@/lib/types/network";
import { base, baseSepolia, sepolia } from "viem/chains";

export const getNetworkConfig = (): NetworkConfig => {
  if (import.meta.env.VITE_USE_MAINNET === "true") {
    baseNetworkConfig.rpcUrl = import.meta.env.VITE_BASE_NODE_URL || "https://base.drpc.org";
    return baseNetworkConfig;
  }

  if (import.meta.env.VITE_USE_SEPOLIA === "true") {
    sepoliaNetworkConfig.rpcUrl =
      import.meta.env.VITE_SEPOLIA_NODE_URL || "https://sepolia.gateway.tenderly.co";
    return sepoliaNetworkConfig;
  }

  baseSepoliaNetworkConfig.rpcUrl =
    import.meta.env.VITE_BASE_NODE_URL || "https://base-sepolia-rpc.publicnode.com";
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
