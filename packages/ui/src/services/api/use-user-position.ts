import { useSession } from "@/context/session-context";
import envParsed from "@/envParsed";
import { getNetworkConfig } from "@/shared/config/network";
import { useQuery } from "@tanstack/react-query";
import { isAddress } from "viem";
import { SinglePositionData, UserPositionData } from "./types/user-position";

export function useUserPosition() {
  const { API_GATEWAY } = envParsed();
  const network = getNetworkConfig().chain;
  const { evmAddress } = useSession();

  return useQuery<SinglePositionData[]>({
    queryKey: ["positions", evmAddress],
    queryFn: async () => {
      if (!isAddress(evmAddress)) {
        console.warn("No wallet address provided");
        return [];
      }
      try {
        const res = await fetch(
          `${API_GATEWAY}/lagoon/position/test/${evmAddress}?offset=0&limit=100&chain_id=${network.id}`,
        );
        if (!res.ok) throw new Error("Network error");

        const data = (await res.json()) as UserPositionData;
        return data?.positions ? data.positions : [];
      } catch (error) {
        console.warn("Error fetching vault data:", error);
        console.warn("Retrieving vault data from contract");
        return [];
      }
    },
    enabled:
      // When wallet is 0x the user is not connected but we still want to get the funds data
      // When wallet is not 0x the connected wallet is validated before fetching the data
      isAddress(evmAddress) ||
      (evmAddress === "0x" && localStorage.getItem("disconnect_requested") !== "true"), // Don't poll if disconnect was requested
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 5000, // Poll every 5 seconds
    refetchIntervalInBackground: true,
  });
}
