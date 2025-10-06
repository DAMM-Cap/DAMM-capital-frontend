import {
  useConnectOrCreateWallet,
  useLogout,
  useMfaEnrollment,
  usePrivy,
} from "@privy-io/react-auth";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

interface SessionContextType {
  evmAddress: string;
  isSignedIn: boolean;
  isConnecting: boolean;
  isSmartAccount: boolean;
  showMfaModal: () => void;
  logout: () => void;
  login: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const { showMfaEnrollmentModal } = useMfaEnrollment();
  const { logout } = useLogout();
  const { ready, authenticated, user } = usePrivy();
  const { connectOrCreateWallet } = useConnectOrCreateWallet();

  const [evmAddress, setEvmAddress] = useState<string>("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSmartAccount, setIsSmartAccount] = useState(false);

  const handleLogin = () => {
    setIsConnecting(true);
    connectOrCreateWallet();
    setTimeout(() => {
      setIsConnecting(false);
    }, 5000);
  };

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (user && authenticated) {
      const wallet = user?.wallet?.address || undefined;
      const smartAccount = user?.smartWallet?.address || undefined;

      setIsSmartAccount(!!smartAccount);
      setEvmAddress(!!smartAccount ? smartAccount! : wallet!);
      setIsSignedIn(true);
      setIsConnecting(false);
    } else {
      setIsSignedIn(false);
      setEvmAddress("");
      setIsConnecting(false);
    }
  }, [ready, user, authenticated]);

  return (
    <SessionContext.Provider
      value={{
        evmAddress,
        isSignedIn,
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
