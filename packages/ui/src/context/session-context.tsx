import {
  useConnectOrCreateWallet,
  useLogout,
  useMfaEnrollment,
  usePrivy,
} from "@privy-io/react-auth";
import { createContext, type ReactNode, useContext, useMemo, useState } from "react";

interface SessionContextType {
  evmAddress: string | null;
  isSignedIn: boolean;
  isConnecting: boolean;
  isSmartAccount: boolean;
  showMfaModal: () => void;
  logout: () => void;
  login: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  // States
  const [isConnecting, setIsConnecting] = useState(false);
  const [embeddedWallet, setEmbeddedWallet] = useState<string | null>(null);

  // Hooks
  const { showMfaEnrollmentModal } = useMfaEnrollment();
  const { logout } = useLogout({
    onSuccess: () => {
      setEmbeddedWallet(null);
    },
  });
  const { ready, user } = usePrivy();
  const { connectOrCreateWallet} = useConnectOrCreateWallet({
    onSuccess: (params) => {
      const { wallet } = params;
      setEmbeddedWallet(wallet.address);
      setIsConnecting(false);
    },
    onError: (error) => {
      setEmbeddedWallet(null);
      console.error("Login error:", error);
      setIsConnecting(false);
    },
  });


  const isSmartAccount = !!user?.smartWallet;
  const evmAddress = useMemo(() => {
    if (isSmartAccount) {
      return user?.smartWallet?.address || null;
    }

    return embeddedWallet;
  }, [user, isSmartAccount, embeddedWallet]);

 const handleLogin = () => {
    if (!ready || isConnecting) return;
    
    console.log("Starting login process...");
    setIsConnecting(true);
    connectOrCreateWallet();
  };


  return (
    <SessionContext.Provider
      value={{
        evmAddress,
        isSignedIn: !!evmAddress,
        isConnecting,
        isSmartAccount,
        showMfaModal: showMfaEnrollmentModal,
        logout,
        login: handleLogin,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
