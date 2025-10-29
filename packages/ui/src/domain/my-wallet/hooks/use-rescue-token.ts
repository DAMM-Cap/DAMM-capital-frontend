import { useSession } from "@/context/session-context";
import { publicClient } from "@/services/viem/viem";
import { getNetworkConfig } from "@/shared/config/network";
import { formatToMaxDefinition } from "@/shared/utils";
import { useQuery } from "@tanstack/react-query";
import { Abi, Address, formatUnits, isAddress, MulticallParameters } from "viem";
import IERC20ABI from "../../../services/lagoon/abis/IERC20-rescue.json";

export interface RescueToken {
  balance: number;
  decimals: number;
  symbol: string;
  name: string;
}

export function useRescueToken({ rescueTokenAddress }: { rescueTokenAddress: string }) {
  const { evmAddress } = useSession();
  const chain = getNetworkConfig().chain;

  return useQuery<RescueToken>({
    queryKey: ["rescueToken", evmAddress, rescueTokenAddress, chain.id],
    queryFn: async () => {
      if (
        !evmAddress ||
        !chain.id ||
        !publicClient ||
        !rescueTokenAddress ||
        !isAddress(rescueTokenAddress) ||
        rescueTokenAddress === "0x0000000000000000000000000000000000000000"
      )
        throw new Error("Invalid ERC20 contract address");

      try {
        const contracts: MulticallParameters["contracts"] = [
          {
            address: rescueTokenAddress as Address,
            abi: IERC20ABI as Abi,
            functionName: "balanceOf",
            args: [evmAddress as Address],
          },
          {
            address: rescueTokenAddress as Address,
            abi: IERC20ABI as Abi,
            functionName: "decimals",
            args: [],
          },
          {
            address: rescueTokenAddress as Address,
            abi: IERC20ABI as Abi,
            functionName: "symbol",
            args: [],
          },
          {
            address: rescueTokenAddress as Address,
            abi: IERC20ABI as Abi,
            functionName: "name",
            args: [],
          },
        ];
        const results = await publicClient.multicall({
          contracts,
          allowFailure: false,
        });

        const decimals = Number(results[1]);
        const symbol = results[2];
        const name = results[3];
        const balance = results[0] as bigint;

        return {
          balance: formatToMaxDefinition(Number(formatUnits(balance, decimals))),
          decimals: decimals,
          symbol: symbol as string,
          name: name as string,
        };
      } catch (error) {
        throw new Error("Invalid ERC20 contract address");
      }
    },
    enabled:
      isAddress(evmAddress) &&
      localStorage.getItem("disconnect_requested") !== "true" &&
      rescueTokenAddress !== "0x0000000000000000000000000000000000000000" &&
      isAddress(rescueTokenAddress), // Don't poll if disconnect was requested or invalid address
    staleTime: 1000 * 30, // 30 seconds
    retry: false, // Don't retry failed queries
  });
}
