Privy Integration Setup (UI)

Follow these steps to configure Privy in this project.

1. Create a Privy app

- Sign up at `https://dashboard.privy.io`
- Create an application and enable:
  - Embedded Wallets (Smart Wallets)
  - Any desired login methods (email, Google, etc.)

2. Configure environment variables

- Copy `.env.example` to `.env.local` (or `.env` for local only)
- Set the following (from Privy dashboard):
  - `VITE_PRIVY_APP_ID`
  - `VITE_PRIVY_CLIENT_ID`

3. Verify Privy providers are wired

- The app is wrapped in `ProvidersWrapper` which includes:
  - `PrivyProvider` and `SmartWalletsProvider`
  - Wagmi (via `PrivyWagmiProvider`)
  - React Query and app contexts

You should not need to change this unless rotating configs.

4. Session usage

- Use `useSession()` from `src/context/session-context.tsx` for:
  - `isSignedIn, isConnecting, evmAddress, isSmartAccount`
  - `login()` and `logout()`
- Call `login()` to trigger Privy login; `logout()` to sign out.

5. Optional chain enforcement

- The session context attempts to keep the connected wallet on the configured chain (see `getNetworkConfig`).
- Adjust logic in `session-context.tsx` if you need different chain behavior.

6. Smart wallet transactions

- Use hooks under `src/services/privy` (e.g., `use-privy-txs`) to execute transactions via Privy smart wallets.
- Ensure your contracts and chain IDs match your environment config.

7. Run locally

- Install: `pnpm install` (or `npm install`/`yarn`)
- Start: `pnpm dev` (or `npm run dev`/`yarn dev`)

Troubleshooting

- Missing or incorrect `VITE_PRIVY_APP_ID`/`VITE_PRIVY_CLIENT_ID` → login won’t render/start
- Browser blocked third-party/cookies → ensure popups/cookies allowed
- Wrong chain → verify `getNetworkConfig()` and wallet network

Privy dashboard configuration details

0. Configuration

- App settings / Domains
  - Add allowed origins from which the app will log in via the Privy SDK (e.g., local dev URL and production domains)
- App settings / Advanced
  - Add allowed OAuth redirect URLs

1. Wallet infrastructure

- Smart wallets
  - Enable Smart Wallets for your app
  - Select Coinbase Smart Wallet, version 1.1
  - Configure chains: add Optimism
- Gas sponsorship
  - Add payment methods and complete sponsorship setup as needed

2. User management

- Authentication / Basics
  - Enable Emails
  - Enable Ethereum External Wallets
  - Enable Passkeys
  - Enable “Automatically create embedded wallets on login” for EVM wallets
- Authentication / Socials
  - Enable Google (and any other desired providers)
- Authentication / MFA
  - Enable MFA for transactions: Authenticator App and Passkey
