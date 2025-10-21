import envParsed from "@/envParsed";
import { optimism, sepolia } from "viem/chains";

import { ethereumChainLogo, optimismChainLogo } from "@/components/token-icons";
import type { Chain } from "viem";

import {addRpcUrlOverrideToChain} from '@privy-io/chains';


export type NetworkConfig = {
  chain: Chain;
  rpcUrl: string;
  network: "ethereum-sepolia" | "optimism";
  explorerUrl: string;
};

const optimismNetworkConfig: NetworkConfig = {
  chain: optimism,
  rpcUrl: "https://optimism.therpc.io",
  network: "optimism",
  explorerUrl: "https://optimistic.etherscan.io",
};

const sepoliaNetworkConfig: NetworkConfig = {
  chain: sepolia,
  rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
  network: "ethereum-sepolia",
  explorerUrl: "https://sepolia.etherscan.io",
};

export const getNetworkConfig = (): NetworkConfig => {
  const { USE_SEPOLIA, SEPOLIA_NODE_URL, OPTIMISM_NODE_URL } = envParsed();

  if (USE_SEPOLIA === "true") {
    sepoliaNetworkConfig.chain = addRpcUrlOverrideToChain(sepolia, SEPOLIA_NODE_URL);
    sepoliaNetworkConfig.rpcUrl = SEPOLIA_NODE_URL;
    return sepoliaNetworkConfig;
  }

  optimismNetworkConfig.chain = addRpcUrlOverrideToChain(optimism, OPTIMISM_NODE_URL);
  optimismNetworkConfig.rpcUrl = OPTIMISM_NODE_URL;
  return optimismNetworkConfig;
};


export const getChainLogo = (chain: Chain) => {
  if (chain.id === 10) return optimismChainLogo;
  if (chain.id === 11155111) return ethereumChainLogo;
  return optimismChainLogo;
};

export const getShortAddress = (address: string) => {
  return address?.slice(0, 6).concat("...").concat(address?.slice(-4));
};
