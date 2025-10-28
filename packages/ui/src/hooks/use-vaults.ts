import { useSession } from "@/context/session-context";
import { DataWrangler } from "@/services/api/lib/data-wrangler";
import { useVaultData } from "@/services/api/use-vault-data";

/**
 * Custom hook to get the vaults data from the API
 * This is an intermediate hook to remove the context useVaults
 */
export function useVaults() {
  const { isSignedIn, evmAddress: usersAccount } = useSession();
  const { data: vaults, isLoading: isLoadingData } = useVaultData(isSignedIn ? usersAccount : "0x");

  return {
    vaults: vaults ? DataWrangler({ data: vaults }) : null,
    isLoading: isLoadingData,
  };
}
