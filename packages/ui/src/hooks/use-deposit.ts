import { getNetworkConfig } from "@/lib/network";
import VaultABI from "@/lib/protocols/abis/Vault.json";
import { getERC20TransferTx } from "@/lib/protocols/utils/eip2612";
import { getApproveTx } from "@/lib/protocols/utils/token-utils";
import { EvmAddress, EvmCall, sendUserOperation } from "@coinbase/cdp-core";
import { useEvmAddress, useIsSignedIn } from "@coinbase/cdp-hooks";
import { TransactionResponse } from "@ethersproject/providers";
import { useAppKitNetwork } from "@reown/appkit/react";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { encodeFunctionData } from "viem";
import { useAccount } from "wagmi";

export function useDeposit() {
  const { address } = useAccount();
  const network = useAppKitNetwork();
  const { evmAddress: smartAccount } = useEvmAddress();
  const isSignedIn = useIsSignedIn();

  const cancelDepositRequest = async (vaultAddress: string) => {
    if (!address) throw new Error("No address found");

    const txs: EvmCall[] = [];

    const cancelDepositRequestCall = {
      to: vaultAddress as EvmAddress,
      value: 0n,
      data: encodeFunctionData({
        abi: VaultABI,
        functionName: "cancelRequestDeposit",
        args: [],
      }),
    };
    txs.push(cancelDepositRequestCall);

    try {
      const txResponse = await executeSmartAccountTransactionBatch(txs);
      return txResponse as unknown as TransactionResponse;
    } catch (error) {
      console.error("Error executing safe transaction:", error);
      throw new Error("Cannot execute cancel deposit request");
    }
  };

  const submitRequestDeposit = async (
    vaultAddress: string,
    underlyingTokenAddress: string,
    tokenDecimals: number,
    feeReceiverAddress: string,
    entranceRate: number,
    amount: string,
  ) => {
    if (!address || !network.chainId) throw new Error("Failed connection");
    if (!smartAccount || !isSignedIn) throw new Error("Failed smart account");

    const txs: EvmCall[] = [];

    const amountInWei = parseUnits(amount, tokenDecimals);

    // Approve tokens to be transferred from safe to the vault
    const approveTx = await getApproveTx(
      smartAccount,
      vaultAddress,
      underlyingTokenAddress,
      BigNumber.from(amountInWei),
    );
    if (approveTx) {
      txs.push({
        to: approveTx.target as EvmAddress,
        value: 0n,
        data: approveTx.callData as `0x${string}`,
      });
    }

    const fee = BigNumber.from(amountInWei)
      .mul(BigNumber.from(Math.floor(entranceRate * 10000)))
      .div(10000);
    const depositAmount = BigNumber.from(amountInWei).sub(fee);

    // Transfer entrance_fee from safe to fee_receiver
    const transferFeeTx = getERC20TransferTx({
      to: feeReceiverAddress as EvmAddress,
      amount: fee.toBigInt(),
      token: underlyingTokenAddress as EvmAddress,
    }) as EvmCall;
    if (transferFeeTx) txs.push(transferFeeTx);

    // Request deposit
    const requestDepositCall = {
      to: vaultAddress as EvmAddress,
      value: 0n,
      data: encodeFunctionData({
        abi: VaultABI,
        functionName: "requestDeposit",
        args: [depositAmount, smartAccount, smartAccount, smartAccount],
      }),
    };
    txs.push(requestDepositCall);

    try {
      const txResponse = await executeSmartAccountTransactionBatch(txs);
      return txResponse as unknown as TransactionResponse;
    } catch (error) {
      console.error("Error executing safe transaction:", error);
      throw new Error("Cannot execute deposit request");
    }
  };

  const executeSmartAccountTransactionBatch = async (txs: EvmCall[]) => {
    const network = getNetworkConfig().network;
    const { userOperationHash } = await sendUserOperation({
      evmSmartAccount: smartAccount as `0x${string}`,
      network: network,
      calls: txs,
    });
    const txResponse = { txHash: userOperationHash };
    return txResponse as unknown as TransactionResponse;
  };

  return {
    submitRequestDeposit,
    cancelDepositRequest,
  };
}
