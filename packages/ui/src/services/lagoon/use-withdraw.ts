import { useSession } from "@/context/session-context";
import { EvmBatchCall, EvmCall, usePrivyTxs } from "@/services/privy/use-privy-txs";
import { TransactionResponse } from "@ethersproject/providers";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import IERC20ABI from "./abis/IERC20.json";
import VaultABI from "./abis/Vault.json";

export function useWithdraw() {
  const { isSignedIn, evmAddress: usersAccount } = useSession();
  const { executePrivyTransactions } = usePrivyTxs();

  const submitRedeem = async (
    vaultAddress: string,
    underlyingTokenAddress: string,
    vaultDecimals: number,
    feeReceiverAddress: string,
    exitRate: number,
    amount: string,
  ) => {
    if (!isSignedIn) throw new Error("Failed connection");
    if (!usersAccount) throw new Error("Failed account");

    const txs: EvmBatchCall = [];

    const amountInWei = parseUnits(amount, vaultDecimals);

    const redeemCall = {
      to: vaultAddress as `0x${string}`,
      value: 0n,
      abi: VaultABI,
      functionName: "redeem",
      args: [amountInWei, usersAccount, usersAccount],
    };
    txs.push(redeemCall);

    // Transfer exit_fee from smart account (or user wallet) to fee_receiver
    const fee = BigNumber.from(amountInWei)
      .mul(BigNumber.from(Math.floor(exitRate * 10000)))
      .div(10000);

    const transferFeeTx: EvmCall = {
      to: underlyingTokenAddress as `0x${string}`,
      value: 0n,
      abi: IERC20ABI,
      functionName: "transfer",
      args: [feeReceiverAddress, fee.toBigInt()],
    };

    if (transferFeeTx) txs.push(transferFeeTx);

    try {
      const txResponse = await executePrivyTransactions(txs);
      return txResponse as unknown as TransactionResponse;
    } catch (error) {
      console.error("Error executing transaction:", error);
      throw new Error("Cannot execute redeem");
    }
  };

  // This should be used instead of submitRequestWithdraw only if the vault
  // has closed state. This is a synchronous operation.
  const submitWithdraw = async (vaultAddress: string, vaultDecimals: number, amount: string) => {
    if (!isSignedIn) throw new Error("Failed connection");
    if (!usersAccount) throw new Error("Failed account");

    const txs: EvmBatchCall = [];

    const amountInWei = parseUnits(amount, vaultDecimals);

    const withdrawCall = {
      to: vaultAddress as `0x${string}`,
      value: 0n,
      abi: VaultABI,
      functionName: "withdraw",
      args: [amountInWei, usersAccount, usersAccount],
    };
    txs.push(withdrawCall);

    try {
      const txResponse = await executePrivyTransactions(txs);
      return txResponse as unknown as TransactionResponse;
    } catch (error) {
      console.error("Error executing transaction:", error);
      throw new Error("Cannot execute withdraw");
    }
  };

  const submitRequestWithdraw = async (
    vaultAddress: string,
    vaultDecimals: number,
    amount: string,
  ) => {
    if (!isSignedIn) throw new Error("Failed connection");
    if (!usersAccount) throw new Error("Failed account");

    const txs: EvmCall[] = [];

    const amountInWei = parseUnits(amount, vaultDecimals);

    const claimSharesAndRequestRedeemCall = {
      to: vaultAddress as `0x${string}`,
      value: 0n,
      abi: VaultABI,
      functionName: "claimSharesAndRequestRedeem",
      args: [amountInWei],
    };
    txs.push(claimSharesAndRequestRedeemCall);

    try {
      const txResponse = await executePrivyTransactions(txs);
      return txResponse as unknown as TransactionResponse;
    } catch (error) {
      console.error("Error executing transaction:", error);
      throw new Error("Cannot execute claim shares and request redeem");
    }
  };

  return { submitRequestWithdraw, submitRedeem, submitWithdraw };
}
