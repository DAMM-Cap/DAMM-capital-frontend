import { useSession } from "@/context/session-context";
import { useQuery } from "@tanstack/react-query";
import { formatUnits } from "viem";
import { publicClient } from "../viem/viem";
import VaultABI from "./abis/Vault.json";

function useOperationState() {
  const { isSignedIn, evmAddress: usersAccount } = useSession();

  const getPendingDepositRequest = async (vaultAddress: string, tokenDecimals: number) => {
    if (!isSignedIn) throw new Error("Failed connection");
    if (!usersAccount) throw new Error("Failed account");

    const depositRequest = (await publicClient.readContract({
      address: vaultAddress as `0x${string}`,
      abi: VaultABI,
      functionName: "pendingDepositRequest",
      args: [0, usersAccount],
    })) as bigint;

    const depositRequestFormatted = formatUnits(depositRequest, tokenDecimals);
    return depositRequestFormatted;
  };

  const getPendingRedeemRequest = async (vaultAddress: string, tokenDecimals: number) => {
    if (!isSignedIn) throw new Error("Failed connection");
    if (!usersAccount) throw new Error("Failed account");

    const redeemRequest = (await publicClient.readContract({
      address: vaultAddress as `0x${string}`,
      abi: VaultABI,
      functionName: "pendingRedeemRequest",
      args: [0, usersAccount],
    })) as bigint;

    const redeemRequestFormatted = formatUnits(redeemRequest, tokenDecimals);
    return redeemRequestFormatted;
  };

  const getClaimableDepositRequest = async (vaultAddress: string, tokenDecimals: number) => {
    if (!isSignedIn) throw new Error("Failed connection");
    if (!usersAccount) throw new Error("Failed account");

    const depositRequest = (await publicClient.readContract({
      address: vaultAddress as `0x${string}`,
      abi: VaultABI,
      functionName: "claimableDepositRequest",
      args: [0, usersAccount],
    })) as bigint;

    const depositRequestFormatted = formatUnits(depositRequest, tokenDecimals);
    return depositRequestFormatted;
  };

  const getClaimableRedeemRequest = async (vaultAddress: string, tokenDecimals: number) => {
    if (!isSignedIn) throw new Error("Failed connection");
    if (!usersAccount) throw new Error("Failed account");

    const redeemRequest = (await publicClient.readContract({
      address: vaultAddress as `0x${string}`,
      abi: VaultABI,
      functionName: "claimableRedeemRequest",
      args: [0, usersAccount],
    })) as bigint;

    const redeemRequestFormatted = formatUnits(redeemRequest, tokenDecimals);
    return redeemRequestFormatted;
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
    getPendingDepositRequest,
    getPendingRedeemRequest,
    getClaimableDepositRequest,
    getClaimableRedeemRequest,
    isWhitelisted,
  };
}

export function useOperationStateQuery(
  vaultAddress?: string,
  tokenDecimals?: number,
  vaultDecimals?: number,
) {
  const { isSignedIn } = useSession();
  const {
    getPendingDepositRequest,
    getPendingRedeemRequest,
    getClaimableDepositRequest,
    getClaimableRedeemRequest,
    isWhitelisted,
  } = useOperationState();

  const {
    data: opState = {
      pendingDepositRequest: 0,
      pendingRedeemRequest: 0,
      claimableDepositRequest: 0,
      claimableRedeemRequest: 0,
      isWhitelisted: false,
    },
  } = useQuery({
    queryKey: ["operationState", vaultAddress, tokenDecimals, vaultDecimals, isSignedIn],
    queryFn: async () => {
      if (!vaultAddress) {
        return {
          pendingDepositRequest: 0,
          pendingRedeemRequest: 0,
          claimableDepositRequest: 0,
          claimableRedeemRequest: 0,
          isWhitelisted: false,
        };
      }
      const [pendingDep, pendingRed, claimDep, claimRed, whitelisted] = (await Promise.all([
        getPendingDepositRequest(vaultAddress, tokenDecimals!),
        getPendingRedeemRequest(vaultAddress, vaultDecimals!),
        getClaimableDepositRequest(vaultAddress, tokenDecimals!),
        getClaimableRedeemRequest(vaultAddress, vaultDecimals!),
        isWhitelisted(vaultAddress) as Promise<boolean>,
      ])) as [string, string, string, string, boolean];

      return {
        pendingDepositRequest: Number(pendingDep),
        pendingRedeemRequest: Number(pendingRed),
        claimableDepositRequest: Number(claimDep),
        claimableRedeemRequest: Number(claimRed),
        isWhitelisted: whitelisted as boolean,
      };
    },
    enabled: Boolean(vaultAddress && isSignedIn),
    refetchInterval: 5000,
  });

  return opState;
}
