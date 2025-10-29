import { useSession } from "@/context/session-context";
import { useQuery } from "@tanstack/react-query";
import { Abi, formatUnits, MulticallParameters } from "viem";
import { publicClient } from "../viem/viem";
import VaultABI from "./abis/Vault.json";

interface OperationStateParams {
  vaultId?: string;
  vaultAddress?: string;
  tokenDecimals?: number;
  vaultDecimals?: number;
}

export function useOperationStateQuery(params: OperationStateParams[]) {
  const { isSignedIn, evmAddress: usersAccount } = useSession();
  
  const getOperationStateData = async (vaultAddress: string, tokenDecimals: number, vaultDecimals: number) => {
    if (!isSignedIn) throw new Error("Failed connection");
    if (!usersAccount) throw new Error("Failed account");

    const contracts: MulticallParameters["contracts"] = [
    {
      address: vaultAddress as `0x${string}`,
      abi: VaultABI as Abi,
      functionName: "pendingDepositRequest",
      args: [0, usersAccount],
    },
    {
      address: vaultAddress as `0x${string}`,
      abi: VaultABI as Abi,
      functionName: "pendingRedeemRequest",
      args: [0, usersAccount],
    },
    {
      address: vaultAddress as `0x${string}`,
      abi: VaultABI as Abi,
      functionName: "claimableDepositRequest",
      args: [0, usersAccount],
    },
    {
      address: vaultAddress as `0x${string}`,
      abi: VaultABI as Abi,
      functionName: "claimableRedeemRequest",
      args: [0, usersAccount],
    },
    {
      address: vaultAddress as `0x${string}`,
      abi: VaultABI as Abi,
      functionName: "isWhitelisted",
      args: [usersAccount],
    }
    ];

    const results = await publicClient.multicall({
      contracts,
      allowFailure: false,
    });

    const pendingDepositRequest = results[0] as bigint;
    const pendingRedeemRequest = results[1] as bigint;
    const claimableDepositRequest = results[2] as bigint;
    const claimableRedeemRequest = results[3] as bigint;
    const isWhitelisted = results[4] as boolean;

    return {
      pendingDepositRequest: formatUnits(pendingDepositRequest, tokenDecimals),
      pendingRedeemRequest: formatUnits(pendingRedeemRequest, vaultDecimals),
      claimableDepositRequest: formatUnits(claimableDepositRequest, tokenDecimals),
      claimableRedeemRequest: formatUnits(claimableRedeemRequest, vaultDecimals),
      isWhitelisted,
    };
  };

  const {
    data: opStates = [],
  } = useQuery({
    queryKey: ["operationStates", params, isSignedIn],
    queryFn: async () => {
      if (!params.length) return [];

      const results = await Promise.all(
        params.map(async ({ vaultId, vaultAddress, tokenDecimals, vaultDecimals }) => {
          if (!vaultAddress) {
            return {
              vaultId: vaultId,
              vaultAddress,
              pendingDepositRequest: 0,
              pendingRedeemRequest: 0,
              claimableDepositRequest: 0,
              claimableRedeemRequest: 0,
              isWhitelisted: false,
            };
          }

          const {
            pendingDepositRequest, 
            pendingRedeemRequest, 
            claimableDepositRequest, 
            claimableRedeemRequest, 
            isWhitelisted
          } = await getOperationStateData(vaultAddress, tokenDecimals!, vaultDecimals!);
          
          return {
            vaultId: vaultId,
            vaultAddress,
            pendingDepositRequest: Number(pendingDepositRequest),
            pendingRedeemRequest: Number(pendingRedeemRequest),
            claimableDepositRequest: Number(claimableDepositRequest),
            claimableRedeemRequest: Number(claimableRedeemRequest),
            isWhitelisted,
          }
        })
      );

      return results;
    },
    enabled: Boolean(params.length && isSignedIn),
    refetchInterval: 0, //5000,
  });

  return { data: opStates };
}
