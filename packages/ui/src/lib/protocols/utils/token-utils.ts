import { getNetworkConfig } from "@/lib/network";
import { publicClient } from "@/services/viem/viem";
import { BigNumber, ethers } from "ethers";
import { createWalletClient, encodeFunctionData, http } from "viem";
import IERC20ABI from "../abis/IERC20.json";

interface Call {
  target: string;
  allowFailure: boolean;
  callData: string;
}

const WETH_ABI = ["function deposit() payable", "function withdraw(uint256 wad)"];

export async function getApproveTx(
  address: string,
  vaultAddress: string,
  underlyingTokenAddress: string,
  amountInWei: BigNumber,
): Promise<Call | null> {
  const allowance = (await publicClient.readContract({
    address: underlyingTokenAddress as `0x${string}`,
    abi: IERC20ABI,
    functionName: "allowance",
    args: [address, vaultAddress],
  })) as bigint;

  if (BigNumber.from(allowance).lt(amountInWei)) {
    // User needs to approve the vault to spend the underlying token
    const approveData = encodeFunctionData({
      abi: IERC20ABI,
      functionName: "approve",
      args: [vaultAddress, amountInWei],
    });
    return {
      target: underlyingTokenAddress,
      allowFailure: false,
      callData: approveData,
    };
  }
  return null;
}

export async function handleApprove(
  address: string,
  vaultAddress: string,
  underlyingTokenAddress: string,
  amountInWei: BigNumber,
  account: `0x${string}`,
) {
  const allowance = (await publicClient.readContract({
    address: underlyingTokenAddress as `0x${string}`,
    abi: IERC20ABI,
    functionName: "allowance",
    args: [address, vaultAddress],
  })) as bigint;

  if (BigNumber.from(allowance).lt(amountInWei)) {
    const client = createWalletClient({
      chain: getNetworkConfig().chain,
      transport: http(),
      account: account,
    });

    // User needs to approve the vault to spend the underlying token
    const txHash = await client.writeContract({
      address: underlyingTokenAddress as `0x${string}`,
      abi: IERC20ABI as any,
      functionName: "approve",
      args: [vaultAddress, amountInWei.toHexString()],
    });

    // Wait for transaction receipt using viem
    await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });
  }
}

export async function wrapNativeETH(
  underlyingTokenAddress: string,
  amountInETH: string,
  account: `0x${string}`,
) {
  const client = createWalletClient({
    chain: getNetworkConfig().chain,
    transport: http(),
    account: account,
  });

  const amount = BigInt(ethers.utils.parseEther(amountInETH).toString());

  const txHash = await client.writeContract({
    address: underlyingTokenAddress as `0x${string}`,
    abi: WETH_ABI,
    functionName: "deposit",
    value: amount,
  });

  await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
}

export async function unwrapWETH(
  underlyingTokenAddress: string,
  amountInWETH: string,
  account: `0x${string}`,
) {
  const client = createWalletClient({
    chain: getNetworkConfig().chain,
    transport: http(),
    account: account,
  });

  const amount = BigInt(ethers.utils.parseEther(amountInWETH).toString());

  const txHash = await client.writeContract({
    address: underlyingTokenAddress as `0x${string}`,
    abi: WETH_ABI,
    functionName: "withdraw",
    args: [amount],
  });

  await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
}
