import { useSession } from "@/context/session-context";
import { EvmBatchCall, EvmCall, usePrivyTxs } from "@/services/privy/use-privy-txs";
import { TransactionResponse } from "@ethersproject/providers";
import { parseUnits } from "ethers/lib/utils";
import IERC20ABI from "../../../services/lagoon/abis/IERC20.json";

export function useSendTokens() {
  const { isSignedIn, evmAddress: usersAccount } = useSession();
  const { executePrivyTransactions } = usePrivyTxs();

  const sendTokens = async (
    underlyingTokenAddress: string,
    tokenDecimals: number,
    receiverAddress: string,
    amount: string,
  ) => {
    if (!isSignedIn) throw new Error("Failed connection");
    if (!usersAccount) throw new Error("Failed account");

    const txs: EvmBatchCall = [];

    const amountInWei = parseUnits(amount, tokenDecimals);

    // Transfer tokens from smartAccount to the receiver
    const transferTx: EvmCall = {
      to: underlyingTokenAddress as `0x${string}`,
      value: 0n,
      abi: IERC20ABI,
      functionName: "transfer",
      args: [receiverAddress, amountInWei],
    };

    if (transferTx) txs.push(transferTx);

    try {
      const txResponse = await executePrivyTransactions(txs);
      return txResponse as unknown as TransactionResponse;
    } catch (error) {
      console.error("Error executing transaction:", error);
      throw new Error("Cannot execute send tokens");
    }
  };

  return {
    sendTokens,
  };
}
