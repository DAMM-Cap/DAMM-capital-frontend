import { useSession } from "@/context/session-context";
import { getNetworkConfig } from "@/shared/config/network";
import { TransactionResponse } from "@ethersproject/providers";
import { useSendTransaction } from "@privy-io/react-auth";
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
  const { isSignedIn, evmAddress: usersAccount, isSmartAccount } = useSession();

  const { client } = useSmartWallets();
  const { sendTransaction } = useSendTransaction();

  const executeWalletTransactionSequence = async (calls: EvmBatchCall) => {
    if (!networkConfig.chain.id || !isSignedIn) throw new Error("Failed connection");
    if (!usersAccount) throw new Error("Failed account");
    if (isSmartAccount) throw new Error("Smart account detected. Wrong execution mode");

    const walletClient = createWalletClient({
      chain: networkConfig.chain,
      transport: http(),
      account: usersAccount as `0x${string}`,
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
        { address: usersAccount },
      );
      txResponse = {
        hash: tx.hash,
        wait: () => waitForTransactionReceipt(walletClient, { hash: tx.hash as `0x${string}` }),
      } as unknown as TransactionResponse;
    }
    return txResponse as unknown as TransactionResponse;
  };

  const executeSmartAccountTransactionBatch = async (calls: EvmBatchCall) => {
    if (!networkConfig.chain.id || !isSignedIn) throw new Error("Failed connection");
    if (!usersAccount) throw new Error("Failed account");
    if (!client) throw new Error("Failed to get client");
    if (!isSmartAccount) throw new Error("Wallet account detected. Wrong execution mode");

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
    if (!networkConfig.chain.id || !isSignedIn) throw new Error("Failed connection");
    if (!usersAccount) throw new Error("Failed account");

    if (isSmartAccount) return executeSmartAccountTransactionBatch(calls);
    else return executeWalletTransactionSequence(calls);
  };

  return {
    executePrivyTransactions,
  };
}
