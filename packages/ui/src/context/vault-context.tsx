import { DataWrangler } from "@/services/api/lib/data-wrangler";
import { DataPresenter } from "@/services/api/types/data-presenter";
import { useVaultData } from "@/services/api/use-vault-data";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useSession } from "./session-context";
interface VaultContextType {
  vaults: DataPresenter | null;
  setVaults: (vaults: DataPresenter | null) => void;
  isLoading: boolean;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

interface VaultProviderProps {
  children: ReactNode;
}

export function VaultProvider({ children }: VaultProviderProps) {
  const { isSignedIn, evmAddress: usersAccount } = useSession();
  const [vaults, setVaults] = useState<DataPresenter | null>(null);

  const vaultDataQuery = useVaultData(isSignedIn ? usersAccount : "0x");
  const { data, isLoading } = vaultDataQuery;

  useEffect(() => {
    if (isLoading) {
      setVaults(null);
    } else if (data) {
      setVaults(DataWrangler({ data }));
    }
  }, [isLoading, data, isSignedIn]);

  return (
    <VaultContext.Provider
      value={{
        vaults,
        setVaults,
        isLoading: isSignedIn ? isLoading : false,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export function useVaults() {
  const context = useContext(VaultContext);
  if (context === undefined) {
    throw new Error("useVaults must be used within a VaultProvider");
  }
  return context;
}
