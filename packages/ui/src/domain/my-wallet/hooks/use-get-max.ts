import { publicClient } from "@/services/viem/viem";
import { useQuery } from "@tanstack/react-query";
import { Abi, Address, formatUnits, isAddress } from "viem";
import IERC20ABI from "@/services/lagoon/abis/IERC20.json";

async function getMaxBalance(
  tokenAddress: Address,
  tokenDecimals: number,
  userAddress: Address,
  publicClient: any,
): Promise<string> {
  const balance = await publicClient.readContract({
    address: tokenAddress,
    abi: IERC20ABI as Abi,
    functionName: "balanceOf",
    args: [userAddress],
  }); 

  return formatUnits(balance, tokenDecimals);
}

export function useGetMax(
  tokenAddress: Address,
  tokenDecimals: number,
  userAddress: Address,
) {
  const { data, ...rest } = useQuery<string>({
    queryKey: ["getMax", userAddress, tokenAddress],
    queryFn: async () => {
      if (!publicClient) {
        throw new Error("Missing required data for get max");
      }
      return getMaxBalance(tokenAddress, tokenDecimals, userAddress, publicClient);
    },
    enabled:
      isAddress(tokenAddress) &&
      isAddress(userAddress),
  });

  return { maxBalance: data, ...rest };
}

