import { getNetworkConfig } from "@/lib/network";
import VaultABI from "@/lib/protocols/abis/Vault.json";
import { getERC20TransferTx } from "@/lib/protocols/utils/eip2612";
import { EvmAddress, EvmCall } from "@coinbase/cdp-core";
import { useEvmAddress, useIsInitialized, useIsSignedIn } from "@coinbase/cdp-hooks";
import { TransactionResponse } from "@ethersproject/providers";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { encodeFunctionData } from "viem";
import { useAccount } from "wagmi";
import { useCDPTxs } from "./use-cdp-txs";

export function useWithdraw() {
  const { address } = useAccount();
  const networkConfig = getNetworkConfig();
  const { evmAddress: smartAccount } = useEvmAddress();
  const isSignedIn = useIsSignedIn();
  const { isInitialized } = useIsInitialized();
  const { executeSmartAccountTransactionBatch } = useCDPTxs();

  const submitRedeem = async (
    vaultAddress: string,
    underlyingTokenAddress: string,
    feeReceiverAddress: string,
    exitRate: number,
    amount: string,
  ) => {
    if (!isInitialized) throw new Error("Failed to initialize");
    if (!address || !networkConfig.chain.id) throw new Error("Failed connection");
    if (!smartAccount || !isSignedIn) throw new Error("Failed smart account");

    const txs: EvmCall[] = [];

    const amountInWei = parseEther(amount);

    const redeemCall = {
      to: vaultAddress as EvmAddress,
      value: 0n,
      data: encodeFunctionData({
        abi: VaultABI,
        functionName: "redeem",
        args: [amountInWei, smartAccount, smartAccount],
      }) as `0x${string}`,
    };
    txs.push(redeemCall);

    // Transfer exit_fee from safe to fee_receiver
    const fee = BigNumber.from(amountInWei)
      .mul(BigNumber.from(Math.floor(exitRate * 10000)))
      .div(10000);
    const transferFeeTx = getERC20TransferTx({
      to: feeReceiverAddress as EvmAddress,
      amount: fee.toBigInt(),
      token: underlyingTokenAddress as EvmAddress,
    });

    if (transferFeeTx) txs.push(transferFeeTx);

    try {
      const txResponse = await executeSmartAccountTransactionBatch(txs);
      return txResponse as unknown as TransactionResponse;
    } catch (error) {
      console.error("Error executing safe transaction:", error);
      throw new Error("Cannot execute redeem");
    }
  };

  // This should be used instead of submitRequestWithdraw only if the vault
  // has closed state. This is a synchronous operation.
  const submitWithdraw = async (vaultAddress: string, amount: string) => {
    if (!isInitialized) throw new Error("Failed to initialize");
    if (!address || !networkConfig.chain.id) throw new Error("Failed connection");
    if (!smartAccount || !isSignedIn) throw new Error("Failed smart account");

    const txs: EvmCall[] = [];

    const amountInWei = parseEther(amount);

    const withdrawCall = {
      to: vaultAddress as EvmAddress,
      value: 0n,
      data: encodeFunctionData({
        abi: VaultABI,
        functionName: "withdraw",
        args: [amountInWei, smartAccount, smartAccount],
      }) as `0x${string}`,
    };
    txs.push(withdrawCall);

    try {
      const txResponse = await executeSmartAccountTransactionBatch(txs);
      return txResponse as unknown as TransactionResponse;
    } catch (error) {
      console.error("Error executing safe transaction:", error);
      throw new Error("Cannot execute withdraw");
    }
  };

  const submitRequestWithdraw = async (vaultAddress: string, amount: string) => {
    if (!isInitialized) throw new Error("Failed to initialize");
    if (!address || !networkConfig.chain.id) throw new Error("Failed connection");
    if (!smartAccount || !isSignedIn) throw new Error("Failed smart account");

    const txs: EvmCall[] = [];

    const amountInWei = parseEther(amount);

    const claimSharesAndRequestRedeemCall = {
      to: vaultAddress as EvmAddress,
      value: 0n,
      data: encodeFunctionData({
        abi: VaultABI,
        functionName: "claimSharesAndRequestRedeem",
        args: [amountInWei],
      }) as `0x${string}`,
    };
    txs.push(claimSharesAndRequestRedeemCall);

    try {
      const txResponse = await executeSmartAccountTransactionBatch(txs);
      return txResponse as unknown as TransactionResponse;
    } catch (error) {
      console.error("Error executing safe transaction:", error);
      throw new Error("Cannot execute claim shares and request redeem");
    }
  };

  return { submitRequestWithdraw, submitRedeem, submitWithdraw };
}
