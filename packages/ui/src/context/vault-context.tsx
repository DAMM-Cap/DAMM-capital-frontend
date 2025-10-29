import { DataWrangler } from "@/services/api/lib/data-wrangler";
import { DataPresenter } from "@/services/api/types/data-presenter";
import { useVaultData } from "@/services/api/use-vault-data";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useSession } from "./session-context";
interface VaultContextType {
  vaults: DataPresenter | null;
  isLoading: boolean;
  pollInterval: number;
  setPollInterval: (pollInterval: number) => void;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

interface VaultProviderProps {
  children: ReactNode;
}

export function VaultProvider({ children }: VaultProviderProps) {
  const [pollInterval, setPollInterval] = useState(1000 * 60 * 5); 
  
  
  const { isSignedIn, evmAddress: usersAccount } = useSession();
  const [vaults, setVaults] = useState<DataPresenter | null>(null);

  const vaultDataQuery = useVaultData(isSignedIn ? usersAccount : "0x", pollInterval);
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
        pollInterval,
        setPollInterval,
        isLoading,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export function useVaults(pollInterval: number) {
  const context = useContext(VaultContext);

  useEffect(() => {
    if (context) {
      context.setPollInterval(pollInterval);
    }
  }, [pollInterval]);


  if (context === undefined) {
    throw new Error("useVaults must be used within a VaultProvider");
  }
  return context;
}
