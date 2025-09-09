import { TokenKey } from "@/lib/constants";
import { getAccessToken, initialize } from "@coinbase/cdp-core";
import { useEvmAddress, useIsSignedIn } from "@coinbase/cdp-hooks";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

type WalletContextType = {
  evmAddress?: string;
  accountId?: string;
  balances: Partial<Record<TokenKey, string>>;
  activeToken: TokenKey;
  setActiveToken: (token: TokenKey) => void;
  refreshBalance: (token?: TokenKey) => void;
};

const WalletContext = createContext<WalletContextType>({
  refreshBalance: () => {},
  setActiveToken: () => {},
  balances: {},
  activeToken: "eth",
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { evmAddress } = useEvmAddress();
  const { isSignedIn } = useIsSignedIn();
  const [evmAddressConnected, setEvmAddressConnected] = useState<string>();
  const [accountId, setAccountId] = useState<string>();
  const [balances, setBalances] = useState<Partial<Record<TokenKey, string>>>({});
  const [activeToken, setActiveToken] = useState<TokenKey>("eth");
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchEvmAddress = useCallback(async () => {
    try {
      // Get the user's access token
      const accessToken = await getAccessToken();

      if (!accessToken) {
        console.warn("No access token available");
        return;
      }

      console.log("Fetching EVM address with access token");
      const res = await fetch("/api/account", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
      });

      console.log("Account API response:", res.status);

      if (res.ok) {
        const { address, accountId } = await res.json();

        // Validate the address matches what CDP provides
        if (evmAddress && address !== evmAddress) {
          console.warn("EVM address mismatch between CDP and API");
        }

        setEvmAddressConnected(address);
        setAccountId(accountId);
        console.log("Successfully fetched address:", address, "accountId:", accountId);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Failed to fetch EVM address:", res.status, errorData);
      }
    } catch (error) {
      console.error("Error fetching EVM address:", error);
    }
  }, [evmAddress]);

  const refreshBalance = useCallback(
    async (token: TokenKey = activeToken) => {
      if (!evmAddressConnected) return;

      const query = token !== "eth" ? `?token=${token}` : "";
      const res = await fetch(`/api/account/balance${query}`);
      if (res.ok) {
        const { balance } = await res.json();
        setBalances((prev) => ({ ...prev, [token]: balance }));
      }
    },
    [evmAddressConnected, activeToken],
  );

  // Initialize CDP when component mounts
  useEffect(() => {
    const initializeCDP = async () => {
      try {
        if (!import.meta.env.VITE_CDP_PROJECT_ID) {
          console.error("VITE_CDP_PROJECT_ID is not set");
          return;
        }

        console.log("Initializing CDP with project ID...");

        // Initialize must be called before any other methods
        await initialize({
          projectId: import.meta.env.VITE_CDP_PROJECT_ID,
        });

        setIsInitialized(true);
        console.log("CDP initialized successfully");
      } catch (error) {
        console.error("Failed to initialize CDP:", error);
      }
    };

    initializeCDP();
  }, []);

  // Fetch EVM address when user signs in and CDP is initialized
  useEffect(() => {
    if (isSignedIn && isInitialized) {
      fetchEvmAddress();
    }
  }, [isSignedIn, isInitialized, fetchEvmAddress]);

  useEffect(() => {
    if (evmAddressConnected) {
      refreshBalance("eth");
    }
  }, [evmAddressConnected, refreshBalance]);

  return (
    <WalletContext.Provider
      value={{
        evmAddress: evmAddressConnected,
        accountId,
        balances,
        activeToken,
        setActiveToken,
        refreshBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
