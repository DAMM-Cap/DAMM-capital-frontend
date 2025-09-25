import { DataWrangler } from "@/lib/data/data-wrangler";
import { DataPresenter } from "@/lib/data/types/data-presenter";
import { useVaultData } from "@/services/api/use-vault-data";
import { usePrivy } from "@privy-io/react-auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
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
  const { user, authenticated } = usePrivy();
  const usersAccount = user?.smartWallet?.address || user?.wallet?.address;

  const [vaults, setVaults] = useState<DataPresenter | null>(null);

  // Check if we have valid addresses
  const hasValidAddresses =
    authenticated && usersAccount && usersAccount.length > 0 && usersAccount.startsWith("0x");

  // Only call useVaultData when we have valid addresses
  const vaultDataQuery = useVaultData(hasValidAddresses ? usersAccount : "0x");
  const { data, isLoading } = vaultDataQuery;

  useEffect(() => {
    if (isLoading) {
      setVaults(null);
    } else if (data) {
      setVaults(DataWrangler({ data }));
    }
  }, [isLoading, data, hasValidAddresses]);

  return (
    <VaultContext.Provider
      value={{
        vaults,
        setVaults,
        isLoading: hasValidAddresses ? isLoading : false,
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
