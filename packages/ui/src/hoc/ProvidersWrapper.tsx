import { LayoutProvider } from "@/context/layout-context";
import { VaultProvider } from "@/context/vault-context";
import { getNetworkConfig } from "@/lib/network";
import { PrivyClientConfig, PrivyProvider } from "@privy-io/react-auth";
import { SmartWalletsProvider } from "@privy-io/react-auth/smart-wallets";
import { createConfig, WagmiProvider as PrivyWagmiProvider } from "@privy-io/wagmi";
import React from "react";
import { http } from "wagmi";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const { chain, rpcUrl } = getNetworkConfig();

export const wagmiConfig = createConfig({
  chains: [chain],
  transports: {
    [chain.id]: http(rpcUrl),
  },
});

const queryClient = new QueryClient();

interface ProvidersWrapperProps {
  children: React.ReactNode;
}

const privyConfig: PrivyClientConfig = {
  defaultChain: chain,
  supportedChains: [chain],
  // Create embedded wallets for users who don't have a wallet
  embeddedWallets: {
    ethereum: {
      createOnLogin: "users-without-wallets",
    },
    showWalletUIs: true,
  },
  externalWallets: {
    walletConnect: { enabled: true },
    coinbaseWallet: {
      config: { preference: { options: "smartWalletOnly" } },
    },
  },
  loginMethods: ["email", "sms", "wallet", "twitter", "google", "github", "passkey"],
  appearance: {
    showWalletLoginFirst: false,
    walletList: [
      "metamask",
      "coinbase_wallet",
      "wallet_connect_qr",
      "rabby_wallet",
      "zerion",
      "binance",
    ],
  },
};

export default function ProvidersWrapper({ children }: ProvidersWrapperProps) {
  return (
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      clientId={import.meta.env.VITE_PRIVY_CLIENT_ID}
      config={privyConfig}
    >
      <SmartWalletsProvider>
        <LayoutProvider>
          <QueryClientProvider client={queryClient}>
            <PrivyWagmiProvider config={wagmiConfig} reconnectOnMount={false}>
              <VaultProvider>{children}</VaultProvider>
            </PrivyWagmiProvider>
          </QueryClientProvider>
        </LayoutProvider>
      </SmartWalletsProvider>
    </PrivyProvider>
  );
}
