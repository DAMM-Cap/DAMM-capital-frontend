import { getNetworkConfig } from "@/lib/network";
import { TransactionResponse } from "@ethersproject/providers";
import { useSendTransaction, useUser } from "@privy-io/react-auth";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { createWalletClient, encodeFunctionData, http } from "viem";
import { waitForTransactionReceipt } from "viem/actions";

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
  const wallet = user?.wallet?.address;
  const { client } = useSmartWallets();
  const { sendTransaction } = useSendTransaction();

  const executeWalletTransactionSequence = async (calls: EvmBatchCall) => {
    if (!networkConfig.chain.id) throw new Error("Failed connection");
    if (!wallet) throw new Error("Failed wallet");

    const walletClient = createWalletClient({
      chain: networkConfig.chain,
      transport: http(),
      account: wallet as `0x${string}`,
    });

    var txResponse: TransactionResponse | undefined;

    for (const call of calls) {
      if (txResponse) await txResponse.wait();
      const tx = await sendTransaction(
        {
          to: call.to,
          value: call.value,
          data: encodeFunctionData({
            abi: call.abi,
            functionName: call.functionName,
            args: call.args,
          }),
        },
        { address: wallet },
      );
      txResponse = {
        hash: tx.hash,
        wait: () => waitForTransactionReceipt(walletClient, { hash: tx.hash as `0x${string}` }),
      } as unknown as TransactionResponse;
    }
    return txResponse as unknown as TransactionResponse;
  };

  const executeSmartAccountTransactionBatch = async (calls: EvmBatchCall) => {
    if (!networkConfig.chain.id) throw new Error("Failed connection");
    if (!smartAccount) throw new Error("Failed smart account");
    if (!client) throw new Error("Failed to get client");

    const txHash = await client.sendUserOperation({
      calls,
    });

    const txResponse = {
      hash: txHash,
      wait: () => client.waitForUserOperationReceipt({ hash: txHash }),
    };

    return txResponse as unknown as TransactionResponse;
  };

  const executePrivyTransactions = async (calls: EvmBatchCall) => {
    if (!networkConfig.chain.id) throw new Error("Failed connection");

    if (smartAccount) {
      return executeSmartAccountTransactionBatch(calls);
    } else if (wallet) {
      return executeWalletTransactionSequence(calls);
    } else {
      throw new Error("Failed to execute transactions");
    }
  };

  return {
    executePrivyTransactions,
  };
}
