import { Chain } from "viem";

export type NetworkConfig = {
  chain: Chain;
  rpcUrl?: string;
  network: "base" | "base-sepolia" | "ethereum-sepolia";
  explorerUrl: string;
};
