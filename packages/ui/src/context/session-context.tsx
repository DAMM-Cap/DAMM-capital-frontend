import {
  useLogout,
  useMfaEnrollment,
  usePrivy,
} from "@privy-io/react-auth";
import { createContext, type ReactNode, useContext, useMemo, useState } from "react";

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
  // States
  const [isConnecting, setIsConnecting] = useState(false);

  // Hooks
  const { showMfaEnrollmentModal } = useMfaEnrollment();
  const { logout } = useLogout();
  const { ready, user, login, authenticated } = usePrivy();

  const isSmartAccount = !!user?.smartWallet;
  const evmAddress = useMemo(() => {
    if (isSmartAccount) {
      return user?.smartWallet?.address ?? "0x";
    }

    return user?.wallet?.address ?? "0x";
  }, [user, isSmartAccount]);

  const handleLogin = async () => {
    if (!ready || isConnecting) return;

    setIsConnecting(true);

    try {
      await login();
    } catch (err) {
      console.error("Login process failed:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <SessionContext.Provider
      value={{
        evmAddress,
        isSignedIn: authenticated,
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
