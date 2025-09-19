import { getNetworkConfig } from "@/lib/network";
import IERC20ABI from "@/lib/protocols/abis/IERC20.json";
import VaultABI from "@/lib/protocols/abis/Vault.json";
import { TransactionResponse } from "@ethersproject/providers";
import { useUser } from "@privy-io/react-auth";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { EvmBatchCall, EvmCall, usePrivyTxs } from "./use-privy-txs";

export function useWithdraw() {
  const networkConfig = getNetworkConfig();
  const { user } = useUser();
  const usersAccount = user?.smartWallet?.address || user?.wallet?.address || undefined;
  const { executePrivyTransactions } = usePrivyTxs();

  const submitRedeem = async (
    vaultAddress: string,
    underlyingTokenAddress: string,
    feeReceiverAddress: string,
    exitRate: number,
    amount: string,
  ) => {
    if (!networkConfig.chain.id) throw new Error("Failed connection");
    if (!usersAccount) throw new Error("Failed smart account");

    const txs: EvmBatchCall = [];

    const amountInWei = parseEther(amount);

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
  const submitWithdraw = async (vaultAddress: string, amount: string) => {
    if (!networkConfig.chain.id) throw new Error("Failed connection");
    if (!usersAccount) throw new Error("Failed smart account");

    const txs: EvmBatchCall = [];

    const amountInWei = parseEther(amount);

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

  const submitRequestWithdraw = async (vaultAddress: string, amount: string) => {
    if (!networkConfig.chain.id) throw new Error("Failed connection");
    if (!usersAccount) throw new Error("Failed smart account");

    const txs: EvmCall[] = [];

    const amountInWei = parseEther(amount);

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
