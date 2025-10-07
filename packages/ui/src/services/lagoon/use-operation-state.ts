import { useSession } from "@/context/session-context";
import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { formatUnits } from "viem";
import { publicClient } from "../viem/viem";
import VaultABI from "./abis/Vault.json";

function useOperationState() {
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

  const getClaimableRedeemRequest = async (vaultAddress: string) => {
    if (!isSignedIn) throw new Error("Failed connection");
    if (!usersAccount) throw new Error("Failed account");

    const redeemRequest = (await publicClient.readContract({
      address: vaultAddress as `0x${string}`,
      abi: VaultABI,
      functionName: "claimableRedeemRequest",
      args: [0, usersAccount],
    })) as bigint;

    const redeemRequestFormatted = formatUnits(redeemRequest, 18);
    console.log("redeemRequestFormatted", redeemRequestFormatted);
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
    isPendingDepositRequest,
    isPendingRedeemRequest,
    isClaimableDepositRequest,
    getClaimableRedeemRequest,
    isWhitelisted,
  };
}

export function useOperationStateQuery(vaultAddress?: string) {
  const { isSignedIn } = useSession();
  const {
    isPendingDepositRequest,
    isPendingRedeemRequest,
    isClaimableDepositRequest,
    getClaimableRedeemRequest,
    isWhitelisted,
  } = useOperationState();

  const {
    data: opState = {
      isPendingDeposit: false,
      isPendingRedeem: false,
      isClaimableDeposit: false,
      isClaimableRedeem: false,
      isWhitelisted: false,
      claimableRedeemRequest: 0,
    },
  } = useQuery({
    queryKey: ["operationState", vaultAddress, isSignedIn],
    queryFn: async () => {
      if (!vaultAddress) {
        return {
          isPendingDeposit: false,
          isPendingRedeem: false,
          isClaimableDeposit: false,
          isClaimableRedeem: false,
          isWhitelisted: false,
          claimableRedeemRequest: 0,
        };
      }
      const [pendingDep, pendingRed, claimDep, claimRed, whitelisted] = await Promise.all([
        isPendingDepositRequest(vaultAddress),
        isPendingRedeemRequest(vaultAddress),
        isClaimableDepositRequest(vaultAddress),
        getClaimableRedeemRequest(vaultAddress),
        isWhitelisted(vaultAddress),
      ]);
      return {
        isPendingDeposit: pendingDep,
        isPendingRedeem: pendingRed,
        isClaimableDeposit: claimDep,
        isClaimableRedeem: Number(claimRed) > 0,
        claimableRedeemRequest: claimRed,
        isWhitelisted: whitelisted,
      };
    },
    enabled: Boolean(vaultAddress && isSignedIn),
    refetchInterval: 5000,
  });

  return opState;
}
