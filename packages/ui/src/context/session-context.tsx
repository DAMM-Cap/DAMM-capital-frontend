import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

export type AppUser = {
  id: string;
  email?: string;
  name?: string;
};

type SessionContextType = {
  status: SessionStatus;
  user: AppUser | null;
  /** Re-fetch the session from backend (GET /api/session) */
  refresh: () => Promise<void>;
  /** Login by exchanging a token/code with backend (POST /api/login) */
  login: (payload?: { token?: string; code?: string }) => Promise<void>;
  /** Logout and clear cookie/session (POST /api/logout) */
  logout: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SessionStatus>("loading");
  const [user, setUser] = useState<AppUser | null>(null);
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    try {
      setStatus((s) => (s === "unauthenticated" ? "loading" : s));
      const res = await fetch("/api/session", { credentials: "include" });
      if (!res.ok) throw new Error("No active session");
      const data: { user: AppUser } = await res.json();
      if (!mounted.current) return;
      setUser(data.user);
      setStatus("authenticated");
    } catch {
      if (!mounted.current) return;
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const login = useCallback(
    async (payload?: { token?: string; code?: string }) => {
      // Backend sets an HttpOnly cookie when login succeeds
      // We can pass a CDP token
      const res = await fetch("/api/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload ?? {}),
      });
      if (!res.ok) {
        throw new Error("Login failed");
      }
      // Once cookie is set, hydrate user
      await refresh();
    },
    [refresh],
  );

  const logout = useCallback(async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    if (!mounted.current) return;
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  useEffect(() => {
    mounted.current = true;
    refresh();
    return () => {
      mounted.current = false;
    };
  }, [refresh]);

  const value = useMemo(
    () => ({ status, user, refresh, login, logout }),
    [status, user, refresh, login, logout],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within a SessionProvider");
  return ctx;
}
