# Configuration Files

This directory contains configuration files used throughout the application for network settings, polling intervals, external links, and address mappings.

---

## Files Overview

| File                  | Purpose                            | Usage                            |
| --------------------- | ---------------------------------- | -------------------------------- |
| `constants.ts`        | Polling intervals for data refresh | Data fetching configuration      |
| `link-utils.ts`       | External vault link generation     | Octav & Kleros Curate links      |
| `network.ts`          | Blockchain network configuration   | Chain selection & RPC setup      |
| `usdc-addresses.ts`   | USDC token addresses by chain      | Price oracle configuration       |
| `vaults-mothers.json` | Vault hierarchy mappings           | Mother-child vault relationships |

---

## 📊 `constants.ts`

**Purpose**: Centralizes polling intervals for different application views.

**Exports**:

- `POLL_BALANCES_MY_WALLET_INTERVAL` - Wallet balance refresh rate
- `POLL_VAULTS_DATA_MY_WALLET_INTERVAL` - Vault data refresh in wallet view
- `POLL_BALANCES_PORTFOLIO_INTERVAL` - Portfolio balance polling (30 seconds)
- `POLL_VAULTS_DATA_PORTFOLIO_INTERVAL` - Portfolio vault data polling (30 seconds)
- `POLL_VAULTS_DATA_FUNDS_INTERVAL` - Funds list refresh rate
- `POLL_BALANCES_FUND_OPERATE_INTERVAL` - Fund operations balance refresh
- `POLL_VAULTS_DATA_FUND_OPERATE_INTERVAL` - Fund operations data refresh

**Usage**:

```typescript
import { POLL_BALANCES_PORTFOLIO_INTERVAL } from "@/shared/config/constants";

// Pass to hooks that need polling configuration
const { data } = useTokensBalance(POLL_BALANCES_PORTFOLIO_INTERVAL);
```

**Note**: Set to `0` to disable automatic polling (manual refetch only).

---

## 🔗 `link-utils.ts`

**Purpose**: Generates external links for vault verification and analytics using vault metadata.

**Exports**:

- `getOctavLinkFromMetadata(vaultMetadata)` - Returns Octav link with mother and children addresses
- `getCurateLinkFromMetadata(vaultMetadata, vaultAddress)` - Returns Kleros Curate link
- `getVaultLinksFromMetadata(vaultMetadata, vaultAddress)` - Returns both links (deprecated)

**Usage**:

```typescript
import { getOctavLinkFromMetadata, getCurateLinkFromMetadata } from "@/shared/config/link-utils";
import { useVaultMetadata } from "@/services/api/use-vault-metadata";

const { data: vaultMetadata } = useVaultMetadata(vaultId);
const octavLink = getOctavLinkFromMetadata(vaultMetadata);
const curateLink = getCurateLinkFromMetadata(vaultMetadata, vaultAddress);

// Use in UI components
<Button onClick={() => window.open(octavLink, "_blank")}>
  View on Octav
</Button>
```

**How it works**:

1. Extracts mother and children addresses from `metadata.structure`
2. If `structure.mother` exists: builds Octav link with mother + children addresses
3. If not found: returns base Octav URL
4. Always generates Curate link with chain ID and vault address

---

## 🌐 `network.ts`

**Purpose**: Manages blockchain network configuration and utilities.

**Exports**:

- `getNetworkConfig()` - Returns active network configuration
- `getChainLogo(chain)` - Returns chain logo component
- `getShortAddress(address)` - Formats address to short version (0x1234...5678)

**Network Configuration**:

```typescript
type NetworkConfig = {
  chain: Chain; // Viem chain object
  rpcUrl: string; // RPC endpoint URL
  network: string; // "optimism" | "ethereum-sepolia"
  explorerUrl: string; // Block explorer URL
};
```

**Usage**:

```typescript
import { getNetworkConfig, getShortAddress } from "@/shared/config/network";

const { chain, rpcUrl, explorerUrl } = getNetworkConfig();
const shortAddr = getShortAddress("0x1234567890abcdef..."); // "0x1234...cdef"
```

**Configuration**:

- Controlled via `VITE_USE_SEPOLIA` environment variable
- RPC URLs from `VITE_SEPOLIA_NODE_URL` or `VITE_OPTIMISM_NODE_URL`
- Defaults to Optimism mainnet when `VITE_USE_SEPOLIA !== "true"`

---

## 💵 `usdc-addresses.ts`

**Purpose**: Maps USDC token addresses across different blockchain networks.

**Exports**:

- `USDC_BY_CHAIN` - Record of chain ID → USDC address
- `UNISWAP_V3_FACTORY` - Uniswap V3 Factory contract address

**Supported Chains**:

- Mainnet (Ethereum)
- Optimism
- Arbitrum
- Base
- Polygon (USDC.e)

**Usage**:

```typescript
import { USDC_BY_CHAIN, UNISWAP_V3_FACTORY } from "@/shared/config/usdc-addresses";

const usdcAddress = USDC_BY_CHAIN[chainId];
if (!usdcAddress) {
  throw new Error(`No USDC configured for chainId ${chainId}`);
}
```

**Use Cases**:

- Price oracle queries (token/USDC pairs)
- Uniswap V3 pool lookups
- USD value conversions

---

## 📦 `vaults-mothers.json`

**Purpose**: Defines hierarchical relationships between vault contracts (mother-child structure).

**Structure**:

```json
{
  "vaults": [
    {
      "vault": "0x...", // Primary vault address
      "mother": "0x...", // Parent/master vault address
      "children": ["0x..."] // Array of child vault addresses
    }
  ]
}
```

**Usage**:

- Used by `link-utils.ts` to generate Octav links with full vault hierarchy
- Enables comprehensive analytics across related vault contracts
- Supports multi-vault strategies visualization

**When to update**:

- Add new vault deployments
- Update mother-child relationships
- Support new vault strategies

---

## Environment Variables

These config files depend on the following environment variables (see `.env.example`):

| Variable                 | Used By                                         | Purpose                                                                     |
| ------------------------ | ----------------------------------------------- | --------------------------------------------------------------------------- |
| `VITE_USE_SEPOLIA`       | `network.ts`                                    | Switch between testnet/mainnet                                              |
| `VITE_SEPOLIA_NODE_URL`  | `network.ts`                                    | Sepolia RPC endpoint                                                        |
| `VITE_OPTIMISM_NODE_URL` | `network.ts`                                    | Optimism RPC endpoint                                                       |
| `VITE_OCTAV_GATEWAY`     | `link-utils.ts`                                 | Octav analytics base URL                                                    |
| `VITE_CURATE_GATEWAY`    | `link-utils.ts`                                 | Kleros Curate base URL                                                      |
| `VITE_MAX_DEFINITION`    | `shared/utils.ts` (via `formatToMaxDefinition`) | Maximum decimal precision for number formatting across the app (default: 5) |

---

## Number Formatting

The `VITE_MAX_DEFINITION` environment variable controls the maximum decimal precision used throughout the application via the `formatToMaxDefinition()` utility function.

**Purpose**: Sets the maximum number of decimal places displayed for all numeric values (balances, prices, APY, etc.)

**Usage**:

```typescript
import { formatToMaxDefinition } from "@/shared/utils";

// All numeric values are formatted using this function
const formattedValue = formatToMaxDefinition(123.456789);
// With VITE_MAX_DEFINITION=5: returns 123.45678
```

**Default**: `5` decimal places if not specified

**Where it's used**:

- Vault metrics (APY, Sharpe ratio, AUM, NAV)
- Token balances and positions
- Price conversions
- All user-facing numeric displays

**Configuration**:

```env
VITE_MAX_DEFINITION=5  # Default: 5 decimal places
```

---

## Best Practices

1. **Polling Intervals**: Keep intervals reasonable to avoid excessive API calls
   - Set to `0` for views that use manual refetch
   - Use 30+ seconds for automatic polling

2. **Network Config**: Always use `getNetworkConfig()` instead of hardcoding chain IDs

3. **Vault Links**: Links automatically handle missing vaults with fallbacks, but keep `vaults-mothers.json` updated for best UX

4. **USDC Addresses**: Verify addresses match deployed contracts on each chain

5. **Decimal Precision**: Adjust `VITE_MAX_DEFINITION` based on your display requirements (higher = more precision, lower = cleaner display)

---

## Related Files

- `@/envParsed.ts` - Environment variable parsing
- `@/services/uniswap/utils.ts` - Uses `usdc-addresses.ts` for price queries
- `@/context/vault-context.tsx` - Uses `constants.ts` for polling
