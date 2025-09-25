import { LayoutProvider } from "@/context/layout-context";
import { SessionProvider } from "@/context/session-context";
import { VaultProvider } from "@/context/vault-context";
import envParsed from "@/envParsed";
import { privyConfig, wagmiConfig } from "@/services/privy/config";
import { PrivyProvider } from "@privy-io/react-auth";
import { SmartWalletsProvider } from "@privy-io/react-auth/smart-wallets";
import { WagmiProvider as PrivyWagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const queryClient = new QueryClient();

interface ProvidersWrapperProps {
  children: React.ReactNode;
}

export default function ProvidersWrapper({ children }: ProvidersWrapperProps) {
  const { PRIVY_APP_ID, PRIVY_CLIENT_ID } = envParsed();

  return (
    <PrivyProvider appId={PRIVY_APP_ID} clientId={PRIVY_CLIENT_ID} config={privyConfig}>
      <SmartWalletsProvider>
        <LayoutProvider>
          <QueryClientProvider client={queryClient}>
            <PrivyWagmiProvider config={wagmiConfig} reconnectOnMount={false}>
              <SessionProvider>
                <VaultProvider>{children}</VaultProvider>
              </SessionProvider>
            </PrivyWagmiProvider>
          </QueryClientProvider>
        </LayoutProvider>
      </SmartWalletsProvider>
    </PrivyProvider>
  );
}
