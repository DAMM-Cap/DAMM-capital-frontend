import { useSession } from "@/context/session-context";
import envParsed from "@/envParsed";
import { getNetworkConfig } from "@/shared/config/network";
import { useQuery } from "@tanstack/react-query";
import { isAddress } from "viem";
import { SinglePositionData, UserPositionData } from "./types/user-position";

async function getUserPosition(wallet: string) {
  const network = getNetworkConfig().chain;
  const { API_GATEWAY } = envParsed();
  const response = await fetch(
    `${API_GATEWAY}/lagoon/position/test/${wallet}?offset=0&limit=100&chain_id=${network.id}`,
  );
  if (!response.ok) throw new Error("Failed to fetch user position");
  return response.json();
}

export function useUserPosition() {
  const { evmAddress } = useSession();

  const { data: positions, ...rest } = useQuery<SinglePositionData[]>({
    queryKey: ["positions", evmAddress],
    queryFn: async () => {
      const data = (await getUserPosition(evmAddress)) as UserPositionData;
      return data?.positions ? data.positions : [];
    },
    enabled: isAddress(evmAddress) || evmAddress === "0x",
  });

  return { positions, ...rest };
}
