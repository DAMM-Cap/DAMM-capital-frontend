import { LayoutProvider } from "@/context/layout-context";
import { SessionProvider } from "@/context/session-context";
import { WalletProvider } from "@/context/wallet-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

import { APP_CONFIG, CDP_CONFIG } from "@/lib/config";
import { getNetworkConfig } from "@/lib/network";
import { theme } from "@/lib/theme";
import { CDPReactProvider } from "@coinbase/cdp-react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";

const { chain, rpcUrl } = getNetworkConfig();

export const wagmiConfig = createConfig({
  chains: [chain],
  transports: {
    [chain.id]: http(rpcUrl),
  },
  connectors: [coinbaseWallet()],
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
          <WalletProvider>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
          </WalletProvider>
        </LayoutProvider>
        {/* </SessionProvider> */}
      </WagmiProvider>
    </CDPReactProvider>
  );
}
