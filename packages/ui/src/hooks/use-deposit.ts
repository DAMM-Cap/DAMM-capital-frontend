import { getNetworkConfig } from "@/lib/network";
import VaultABI from "@/lib/protocols/abis/Vault.json";
import { getERC20TransferTx } from "@/lib/protocols/utils/eip2612";
import { getApproveTx } from "@/lib/protocols/utils/token-utils";
import { EvmAddress, EvmCall } from "@coinbase/cdp-core";
import { useEvmAddress, useIsInitialized, useIsSignedIn } from "@coinbase/cdp-hooks";
import { TransactionResponse } from "@ethersproject/providers";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { Abi, encodeFunctionData } from "viem";
import { useAccount } from "wagmi";
import { useCDPTxs } from "./use-cdp-txs";

// Filter ABI to only include the 4-parameter requestDeposit function
const RequestDepositABI = VaultABI.filter(
  (item: any) => item.name === "requestDeposit" && item.inputs?.length === 4,
) as Abi;

export function useDeposit() {
  const { address } = useAccount();
  const networkConfig = getNetworkConfig();
  const { evmAddress: smartAccount } = useEvmAddress();
  const isSignedIn = useIsSignedIn();
  const { isInitialized } = useIsInitialized();
  const { executeSmartAccountTransactionBatch } = useCDPTxs();

  const cancelDepositRequest = async (vaultAddress: string) => {
    if (!isInitialized) throw new Error("Failed to initialize");
    if (!address || !networkConfig.chain.id) throw new Error("Failed connection");
    if (!smartAccount || !isSignedIn) throw new Error("Failed smart account");

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
    if (!isInitialized) throw new Error("Failed to initialize");
    if (!address || !networkConfig.chain.id) throw new Error("Failed connection");
    if (!smartAccount || !isSignedIn) throw new Error("Failed smart account");

    const txs: EvmCall[] = [];

    const amountInWei = parseUnits(amount, tokenDecimals);

    // Approve tokens to be transferred from smartAccount to the vault
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

    // Transfer entrance_fee from smartAccount to fee_receiver
    const transferFeeTx = getERC20TransferTx({
      to: feeReceiverAddress as EvmAddress,
      amount: fee.toBigInt(),
      token: underlyingTokenAddress as EvmAddress,
    }) as EvmCall;
    if (transferFeeTx) txs.push(transferFeeTx);

    // Request deposit with referral (4 parameters)
    const requestDepositCall = {
      to: vaultAddress as EvmAddress,
      value: 0n,
      data: encodeFunctionData({
        abi: RequestDepositABI,
        functionName: "requestDeposit",
        args: [depositAmount, smartAccount, smartAccount, smartAccount],
      }) as `0x${string}`,
    };
    txs.push(requestDepositCall);

    try {
      const txResponse = await executeSmartAccountTransactionBatch(txs);
      return txResponse as unknown as TransactionResponse;
    } catch (error) {
      console.error("Error executing smart account transaction:", error);
      throw new Error("Cannot execute deposit request");
    }
  };

  return {
    submitRequestDeposit,
    cancelDepositRequest,
  };
}
