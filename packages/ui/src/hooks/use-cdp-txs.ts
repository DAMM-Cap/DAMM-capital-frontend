import { getNetworkConfig } from "@/lib/network";
import { EvmCall } from "@coinbase/cdp-core";
import {
  useEvmAddress,
  useIsInitialized,
  useIsSignedIn,
  useSendUserOperation,
} from "@coinbase/cdp-hooks";
import { TransactionResponse } from "@ethersproject/providers";
import { useAccount } from "wagmi";

export function useCDPTxs() {
  const networkConfig = getNetworkConfig();
  const { evmAddress: smartAccount } = useEvmAddress();
  const isSignedIn = useIsSignedIn();
  const { address } = useAccount();
  const { sendUserOperation } = useSendUserOperation();
  const { isInitialized } = useIsInitialized();

  const executeSmartAccountTransactionBatch = async (txs: EvmCall[]) => {
    if (!isInitialized) throw new Error("Failed to initialize");
    if (!address || !networkConfig.chain.id) throw new Error("Failed connection");
    if (!smartAccount || !isSignedIn) throw new Error("Failed smart account");

    const { userOperationHash } = await sendUserOperation({
      evmSmartAccount: smartAccount as `0x${string}`,
      network: networkConfig.network,
      calls: txs,
    });
    const txResponse = { txHash: userOperationHash };
    return txResponse as unknown as TransactionResponse;
  };

  return {
    executeSmartAccountTransactionBatch,
  };
}
