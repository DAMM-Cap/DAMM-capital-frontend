import { getNetworkConfig } from "@/shared/config/network";
import { PrivyClientConfig } from "@privy-io/react-auth";
import { createConfig } from "@privy-io/wagmi";
import { http } from "wagmi";

const { chain, rpcUrl } = getNetworkConfig();

export const privyConfig: PrivyClientConfig = {
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

export const wagmiConfig = createConfig({
  chains: [chain],
  transports: {
    [chain.id]: http(rpcUrl),
  },
});
