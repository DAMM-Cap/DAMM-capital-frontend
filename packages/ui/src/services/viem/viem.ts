import { getNetworkConfig } from "@/shared/config/network";
import { createPublicClient, http } from "viem";

const { chain, rpcUrl } = getNetworkConfig();
export const publicClient = createPublicClient({
  chain,
  transport: http(rpcUrl),
});
