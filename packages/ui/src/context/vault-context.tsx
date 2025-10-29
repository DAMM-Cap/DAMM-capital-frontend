import { DataWrangler } from "@/services/api/lib/data-wrangler";
import { DataPresenter } from "@/services/api/types/data-presenter";
import { VaultDataResponse } from "@/services/api/types/vault-data";
import { useVaultData } from "@/services/api/use-vault-data";
import { QueryObserverResult } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useSession } from "./session-context";
interface VaultContextType {
  vaults: DataPresenter | null;
  isLoading: boolean;
  pollInterval: number;
  setPollInterval: (pollInterval: number) => void;
  refetch: () => Promise<QueryObserverResult<VaultDataResponse, Error>>;
  //refetch: () => void;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

interface VaultProviderProps {
  children: ReactNode;
}

export function VaultProvider({ children }: VaultProviderProps) {
  const [pollInterval, setPollInterval] = useState(0); 
  
  const { isSignedIn, evmAddress: usersAccount } = useSession();
  const [vaults, setVaults] = useState<DataPresenter | null>(null);

  const vaultDataQuery = useVaultData(isSignedIn ? usersAccount : "0x", pollInterval);
  const { data, isLoading, refetch } = vaultDataQuery;

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
        refetch: async () => await refetch(),
        //refetch,
        isLoading,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export function useVaults(pollInterval: number, refetch?: boolean) {
  const context = useContext(VaultContext);

  useEffect(() => {
    if (!context) return;
    context.setPollInterval(pollInterval);
    if (refetch) context.refetch();
  }, [refetch, pollInterval]);

  if (context === undefined) {
    throw new Error("useVaults must be used within a VaultProvider");
  }
  return context;
}
