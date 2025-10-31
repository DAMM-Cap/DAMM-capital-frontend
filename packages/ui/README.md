# Privy Integration Setup

This guide walks you through configuring Privy authentication and wallet integration for the UI package.

---

## Quick Start

1. [Create a Privy app](#1-create-a-privy-app)
2. [Configure environment variables](#2-configure-environment-variables)
3. [Verify providers](#3-verify-privy-providers-are-wired)
4. [Use session hooks](#4-session-usage)
5. [Run locally](#7-run-locally)

---

## Step-by-Step Setup

### 1. Create a Privy app

1. Sign up at [Privy Dashboard](https://dashboard.privy.io)
2. Create a new application
3. Enable the following features:
   - **Embedded Wallets** (Smart Wallets)
   - **Login methods**: Email, Google, and any other desired authentication providers

---

### 2. Configure environment variables

1. Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

2. Set the following variables (values from your Privy dashboard):
   ```env
   VITE_PRIVY_APP_ID=your_app_id_here
   VITE_PRIVY_CLIENT_ID=your_client_id_here
   ```

> **Note**: Use `.env.local` for local development or `.env` if preferred.

---

### 3. Verify Privy providers are wired

The application is automatically wrapped in `ProvidersWrapper` located at:

```
src/hoc/providers-wrapper.tsx
```

This includes:

- ✅ `PrivyProvider` and `SmartWalletsProvider`
- ✅ Wagmi integration via `PrivyWagmiProvider`
- ✅ React Query setup
- ✅ Application contexts (Session, Vault, etc.)

> **Note**: You typically won't need to modify this unless rotating configurations or adding new providers.

---

### 4. Session usage

Import and use the `useSession()` hook from the session context:

```typescript
import { useSession } from "@/context/session-context";

function MyComponent() {
  const { isSignedIn, isConnecting, evmAddress, isSmartAccount, login, logout } = useSession();

  // Use session state and methods
}
```

**Available properties:**

- `isSignedIn`: Boolean indicating authentication status
- `isConnecting`: Boolean for connection in-progress state
- `evmAddress`: User's Ethereum address
- `isSmartAccount`: Boolean indicating if using smart wallet
- `login()`: Function to trigger Privy login flow
- `logout()`: Function to sign out user

---

### 5. Optional: Chain enforcement

The session context automatically attempts to keep the connected wallet on the configured chain (see `getNetworkConfig()`).

To customize chain behavior, modify the logic in:

```
src/context/session-context.tsx
```

---

### 6. Smart wallet transactions

Use hooks under `src/services/privy/` to execute transactions:

```typescript
import { usePrivyTxs } from "@/services/privy/use-privy-txs";

// Example: Execute transactions via Privy smart wallets
const { executePrivyTransactions } = usePrivyTxs();
```

> **Important**: Ensure your contract addresses and chain IDs match your environment configuration.

---

### 7. Run locally

1. **Install dependencies:**

   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

2. **Start development server:**
   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

---

## Privy Dashboard Configuration

### 0. Configuration

#### App Settings → Domains

- Add **allowed origins** from which the app will authenticate via the Privy SDK
  - Include your local development URL (e.g., `http://localhost:5173`)
  - Include your production domains

#### App Settings → Advanced

- Add **allowed OAuth redirect URLs**
  - Configure callback URLs for OAuth providers

---

### 1. Wallet Infrastructure

#### Smart Wallets

- ✅ Enable **Smart Wallets** for your app
- Select **Coinbase Smart Wallet**, version **1.1**
- **Configure chains**: Add **Optimism** to supported networks

#### Gas Sponsorship

- Add payment methods
- Complete gas sponsorship setup as needed for your use case

---

### 2. User Management

#### Authentication → Basics

- ✅ Enable **Emails**
- ✅ Enable **Ethereum External Wallets**
- ✅ Enable **Passkeys**
- ✅ Enable **"Automatically create embedded wallets on login"** for EVM wallets

#### Authentication → Socials

- ✅ Enable **Google** (and any other desired social providers)

#### Authentication → MFA

- ✅ Enable **MFA for transactions**
  - Authenticator App
  - Passkey

---

## Troubleshooting

| Issue                           | Solution                                                                                              |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Login won't render or start     | Check that `VITE_PRIVY_APP_ID` and `VITE_PRIVY_CLIENT_ID` are set correctly in your `.env.local` file |
| Browser blocking authentication | Ensure popups and third-party cookies are allowed in your browser settings                            |
| Wrong network/chain             | Verify `getNetworkConfig()` returns the expected chain and check wallet network settings              |
| Transactions failing            | Confirm contract addresses and chain IDs match your environment configuration                         |

---

## Additional Resources

- [Privy Documentation](https://docs.privy.io/)
- [Privy Dashboard](https://dashboard.privy.io)
- [Wagmi Documentation](https://wagmi.sh/)
