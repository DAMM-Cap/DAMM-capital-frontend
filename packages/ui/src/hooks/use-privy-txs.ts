import { getNetworkConfig } from "@/lib/network";
import { TransactionResponse } from "@ethersproject/providers";
import { useUser } from "@privy-io/react-auth";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";

export type EvmCall = {
  to: `0x${string}`;
  value?: bigint;
  abi: readonly unknown[];
  functionName: string;
  args?: readonly unknown[];
};
export type EvmBatchCall = Array<EvmCall>;

export function usePrivyTxs() {
  const networkConfig = getNetworkConfig();
  const { user } = useUser();
  const smartAccount = user?.smartWallet?.address;
  const { client } = useSmartWallets();

  const executeSmartAccountTransactionBatch = async (calls: EvmBatchCall) => {
    if (!networkConfig.chain.id) throw new Error("Failed connection");
    if (!smartAccount) throw new Error("Failed smart account");
    if (!client) throw new Error("Failed to get client");

    const txHash = await client.sendUserOperation({
      calls,
    });

    const txResponse = {
      hash: txHash,
      wait: () =>
        client.waitForUserOperationReceipt({
          hash: txHash,
        }),
    };

    return txResponse as unknown as TransactionResponse;
  };

  return {
    executeSmartAccountTransactionBatch,
  };
}
