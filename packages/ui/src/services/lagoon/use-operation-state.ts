import { useSession } from "@/context/session-context";
import { publicClient } from "../viem/viem";
import VaultABI from "./abis/Vault.json";

export function useOperationState() {
  const { isSignedIn, evmAddress: usersAccount } = useSession();

  const isPendingDepositRequest = async (vaultAddress: string) => {
    if (!isSignedIn) throw new Error("Failed connection");
    if (!usersAccount) throw new Error("Failed account");

    const depositRequest = (await publicClient.readContract({
      address: vaultAddress as `0x${string}`,
      abi: VaultABI,
      functionName: "pendingDepositRequest",
      args: [0, usersAccount],
    })) as bigint;
    return depositRequest > 0;
  };

  const isPendingRedeemRequest = async (vaultAddress: string) => {
    if (!isSignedIn) throw new Error("Failed connection");
    if (!usersAccount) throw new Error("Failed account");

    const redeemRequest = (await publicClient.readContract({
      address: vaultAddress as `0x${string}`,
      abi: VaultABI,
      functionName: "pendingRedeemRequest",
      args: [0, usersAccount],
    })) as bigint;
    return redeemRequest > 0;
  };

  const isClaimableDepositRequest = async (vaultAddress: string) => {
    if (!isSignedIn) throw new Error("Failed connection");
    if (!usersAccount) throw new Error("Failed account");

    const depositRequest = (await publicClient.readContract({
      address: vaultAddress as `0x${string}`,
      abi: VaultABI,
      functionName: "claimableDepositRequest",
      args: [0, usersAccount],
    })) as bigint;
    return depositRequest > 0;
  };

  const isClaimableRedeemRequest = async (vaultAddress: string) => {
    if (!isSignedIn) throw new Error("Failed connection");
    if (!usersAccount) throw new Error("Failed account");

    const redeemRequest = (await publicClient.readContract({
      address: vaultAddress as `0x${string}`,
      abi: VaultABI,
      functionName: "claimableRedeemRequest",
      args: [0, usersAccount],
    })) as bigint;
    return redeemRequest > 0;
  };

  const isWhitelisted = async (vaultAddress: string) => {
    if (!isSignedIn) throw new Error("Failed connection");
    if (!usersAccount) throw new Error("Failed account");

    const whitelisted = (await publicClient.readContract({
      address: vaultAddress as `0x${string}`,
      abi: VaultABI,
      functionName: "isWhitelisted",
      args: [usersAccount],
    })) as boolean;
    return whitelisted;
  };

  return {
    isPendingDepositRequest,
    isPendingRedeemRequest,
    isClaimableDepositRequest,
    isClaimableRedeemRequest,
    isWhitelisted,
  };
}
