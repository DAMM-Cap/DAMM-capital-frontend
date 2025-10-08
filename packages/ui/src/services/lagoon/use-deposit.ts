import { useSession } from "@/context/session-context";
import { getApproveTx } from "@/services/lagoon/utils/token-utils";
import { EvmBatchCall, EvmCall, usePrivyTxs } from "@/services/privy/use-privy-txs";
import { TransactionResponse } from "@ethersproject/providers";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { Abi } from "viem";
import { referralToAddress } from "../viem/utils";
import IERC20ABI from "./abis/IERC20.json";
import VaultABI from "./abis/Vault.json";

// Filter ABI to only include the 4-parameter requestDeposit function
const RequestDepositABI = VaultABI.filter(
  (item: any) => item.name === "requestDeposit" && item.inputs?.length === 4,
) as Abi;

export function useDeposit() {
  const { isSignedIn, evmAddress: usersAccount } = useSession();
  const { executePrivyTransactions } = usePrivyTxs();

  const cancelDepositRequest = async (vaultAddress: string) => {
    if (!isSignedIn) throw new Error("Failed connection");
    if (!usersAccount) throw new Error("Failed account");

    const txs: EvmBatchCall = [];

    const cancelDepositRequestCall: EvmCall = {
      to: vaultAddress as `0x${string}`,
      value: 0n,
      abi: VaultABI,
      functionName: "cancelRequestDeposit",
      args: [],
    };
    txs.push(cancelDepositRequestCall);

    try {
      const txResponse = await executePrivyTransactions(txs);
      return txResponse as unknown as TransactionResponse;
    } catch (error) {
      console.error("Error executing transaction:", error);
      throw new Error("Cannot execute cancel deposit request");
    }
  };

  const submitRequestDeposit = async (
    vaultAddress: string,
    referral: string,
    underlyingTokenAddress: string,
    tokenDecimals: number,
    feeReceiverAddress: string,
    entranceRate: number,
    amount: string,
  ) => {
    if (!isSignedIn) throw new Error("Failed connection");
    if (!usersAccount) throw new Error("Failed account");

    const txs: EvmCall[] = [];

    const amountInWei = parseUnits(amount, tokenDecimals);

    // Approve tokens to be transferred from smartAccount to the vault
    const approveTx = await getApproveTx(
      usersAccount,
      vaultAddress,
      underlyingTokenAddress,
      BigNumber.from(amountInWei),
    );
    if (approveTx) {
      txs.push({
        to: approveTx.target as `0x${string}`,
        value: 0n,
        abi: IERC20ABI,
        functionName: "approve",
        args: [vaultAddress, amountInWei],
      });
    }

    const fee = BigNumber.from(amountInWei)
      .mul(BigNumber.from(Math.floor(entranceRate * 10000)))
      .div(10000);
    const depositAmount = BigNumber.from(amountInWei).sub(fee);

    // Transfer entrance_fee from smartAccount to fee_receiver
    const transferFeeTx: EvmCall = {
      to: underlyingTokenAddress as `0x${string}`,
      value: 0n,
      abi: IERC20ABI,
      functionName: "transfer",
      args: [feeReceiverAddress, fee.toBigInt()],
    };

    if (transferFeeTx) txs.push(transferFeeTx);

    // Request deposit with referral (4 parameters)
    let encodedReferral = usersAccount;
    if (referral.length >= 4) {
      encodedReferral = referralToAddress(referral, {
        caseInsensitive: false,
        namespace: "DAMM-Capital",
      });
    }
    const requestDepositCall = {
      to: vaultAddress as `0x${string}`,
      value: 0n,
      abi: RequestDepositABI,
      functionName: "requestDeposit",
      args: [depositAmount, usersAccount, usersAccount, encodedReferral],
    };
    txs.push(requestDepositCall);

    try {
      const txResponse = await executePrivyTransactions(txs);
      return txResponse as unknown as TransactionResponse;
    } catch (error) {
      console.error("Error executing smart account transaction:", error);
      throw new Error("Cannot execute deposit request");
    }
  };

  const submitDeposit = async (vaultAddress: string, vaultDecimals: number, amount: string) => {
    if (!isSignedIn) throw new Error("Failed connection");
    if (!usersAccount) throw new Error("Failed account");

    const txs: EvmBatchCall = [];

    const amountInWei = parseUnits(amount, vaultDecimals);

    const depositCall = {
      to: vaultAddress as `0x${string}`,
      value: 0n,
      abi: VaultABI,
      functionName: "deposit",
      args: [amountInWei, usersAccount, usersAccount],
    };
    txs.push(depositCall);

    try {
      const txResponse = await executePrivyTransactions(txs);
      return txResponse as unknown as TransactionResponse;
    } catch (error) {
      console.error("Error executing transaction:", error);
      throw new Error("Cannot execute deposit");
    }
  };

  return {
    submitRequestDeposit,
    cancelDepositRequest,
    submitDeposit,
  };
}
