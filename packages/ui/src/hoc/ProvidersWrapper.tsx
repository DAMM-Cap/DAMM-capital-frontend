import { LayoutProvider } from "@/context/layout-context";
import { SessionProvider } from "@/context/session-context";
import { VaultProvider } from "@/context/vault-context";
import { WalletProvider } from "@/context/wallet-context";
import { APP_CONFIG, CDP_CONFIG } from "@/lib/config";
import { getNetworkConfig } from "@/lib/network";
import { theme } from "@/lib/theme";
import { Config } from "@coinbase/cdp-core";
import { CDPReactProvider } from "@coinbase/cdp-react";
import { createCDPEmbeddedWalletConnector } from "@coinbase/cdp-wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";

const { chain, rpcUrl } = getNetworkConfig();

const connector = createCDPEmbeddedWalletConnector({
  //cdpConfig: cdpConfig,
  cdpConfig: CDP_CONFIG,
  providerConfig: {
    /* chains: [base, baseSepolia],
    transports: {
      [base.id]: http(),
      [baseSepolia.id]: http(),
    }, */
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
  //connectors: [coinbaseWallet()],
  connectors: [connector],
});

const queryClient = new QueryClient();

interface ProvidersWrapperProps {
  children: React.ReactNode;
}

export default function ProvidersWrapper({ children }: ProvidersWrapperProps) {
  return (
    <CDPReactProvider config={CDP_CONFIG} app={APP_CONFIG} theme={theme}>
      <WagmiProvider config={wagmiConfig}>
        {/* <SessionProvider> */}
        <LayoutProvider>
          {/* <WalletProvider> */}
          <QueryClientProvider client={queryClient}>
            <VaultProvider>{children}</VaultProvider>
          </QueryClientProvider>
          {/* </WalletProvider> */}
        </LayoutProvider>
        {/* </SessionProvider> */}
      </WagmiProvider>
    </CDPReactProvider>
  );
}
