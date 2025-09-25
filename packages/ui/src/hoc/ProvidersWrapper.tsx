import { LayoutProvider } from "@/context/layout-context";
import { VaultProvider } from "@/context/vault-context";
import { WalletProvider } from "@/context/wallet-context";
import { APP_CONFIG, CDP_CONFIG } from "@/lib/config";
import { getNetworkConfig } from "@/lib/network";
import { theme } from "@/lib/theme";
import { CDPReactProvider } from "@coinbase/cdp-react";
import { createCDPEmbeddedWalletConnector } from "@coinbase/cdp-wagmi";
import { PrivyProvider } from "@privy-io/react-auth";
import { SmartWalletsProvider } from "@privy-io/react-auth/smart-wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import React from "react";
import { createConfig, http, WagmiProvider } from "wagmi";

const { chain, rpcUrl } = getNetworkConfig();

const connector = createCDPEmbeddedWalletConnector({
  cdpConfig: CDP_CONFIG,
  providerConfig: {
    chains: [chain],
    transports: {
      [chain.id]: http(rpcUrl),
    },
  },
});

export const wagmiConfig = createConfig({
  chains: [chain],
  transports: {
    [chain.id]: http(rpcUrl),
  },
  connectors: [connector],
});

const queryClient = new QueryClient();

interface ProvidersWrapperProps {
  children: React.ReactNode;
}

export default function ProvidersWrapper({ children }: ProvidersWrapperProps) {
  return (
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      clientId={import.meta.env.VITE_PRIVY_CLIENT_ID}
      config={{
        defaultChain: chain,
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
          showWalletUIs: true,
        },
      }}
    >
      <SmartWalletsProvider>
        {/* <CDPReactProvider config={CDP_CONFIG} app={APP_CONFIG} theme={theme}> */}
        <WagmiProvider config={wagmiConfig}>
          <LayoutProvider>
            {/* <WalletProvider> */}
            <QueryClientProvider client={queryClient}>
              <VaultProvider>{children}</VaultProvider>
            </QueryClientProvider>
            {/* </WalletProvider> */}
          </LayoutProvider>
        </WagmiProvider>
        {/* </CDPReactProvider> */}
      </SmartWalletsProvider>
    </PrivyProvider>
  );
}
