# Uniswap V3 Price Oracle

This module provides USD price discovery for ERC-20 tokens using Uniswap V3 pools via on-chain RPC calls.

---

## Overview

The `getUsdPrice()` function calculates the USD price of any token by:

1. Finding available Uniswap V3 pools between the token and USDC
2. Selecting the pool with the highest liquidity
3. Converting the pool's tick value to a USD price

All contract interactions use **multicall** to minimize RPC round trips.

---

## Algorithm Flow

### Step 1: Get USDC Address & Token Decimals

```typescript
const USDC = USDC_BY_CHAIN[chainId]; // From shared/config/usdc-addresses.ts
```

- Retrieves the USDC contract address for the specified chain
- Fetches token decimals via ERC-20 `decimals()` call

### Step 2: Query Uniswap V3 Factory

Queries the Uniswap V3 Factory contract (`0x1F98431c8aD98523631AE4a59f267346ea31F984`) across multiple fee tiers:

- **Fee Tiers**: `500` (0.05%), `3000` (0.3%), `10000` (1%)
- **Function**: `getPool(tokenA, tokenB, fee)`
- Returns pool addresses (or zero address if pool doesn't exist)

**Token Pair Ordering**:

- Uniswap requires tokens in ascending address order
- Algorithm ensures `tokenA < tokenB` lexicographically

### Step 3: Filter Valid Pools

Filters out non-existent pools (zero addresses) and keeps only valid pool contracts.

### Step 4: Fetch Pool Data (Multicall)

For each valid pool, fetches:

- `liquidity()` - Current liquidity in the pool
- `token0()` - First token address (lower address)
- `token1()` - Second token address (higher address)
- `slot0()` - Contains `sqrtPriceX96` and `tick` (current price tick)

### Step 5: Select Best Pool

**Selection Criteria**: Highest liquidity

```typescript
const candidates = pools.sort((a, b) => (a.liquidity < b.liquidity ? 1 : -1));
const best = candidates[0]!;
```

Pools with more liquidity provide more accurate and stable prices.

### Step 6: Calculate USD Price from Tick

**Tick to Price Conversion**:

```typescript
function tickToPrice(tick: number, dec0: number, dec1: number) {
  return Math.pow(1.0001, tick) * 10 ** (dec0 - dec1);
}
```

**Formula**: `price = 1.0001^tick * 10^(decimals0 - decimals1)`

**Key Points**:

- Uniswap V3 uses tick-based pricing: `price = 1.0001^tick`
- Accounts for token decimals to normalize the price
- If token is `token0`: price is direct
- If token is `token1`: price is inverted (1 / price)

**Final USD Calculation**:

```typescript
const tokenIs0 = best.token0.toLowerCase() === token.toLowerCase();
const p = tickToPrice(best.tick, tokenDecimals, usdcDecimals);
const usd = tokenIs0 ? p : 1 / p;
```

---

## Usage

```typescript
import { getUsdPrice } from "@/services/uniswap/utils";

const result = await getUsdPrice({
  chainId: 10, // Optimism
  token: "0x68f180fcCe6836688e9084f035309E29Bf0A2095", // WBTC
});

// Returns:
// {
//   usd: 109123.25,
//   pool: "0x...",
//   feeTierBps: 3000,
//   liquidity: "1234567890"
// }
```

---

## Dependencies

- **USDC Addresses**: `@/shared/config/usdc-addresses.ts`
  - Provides chain-specific USDC contract addresses
  - Uniswap V3 Factory address

- **RPC Client**: Uses `publicClient` from `@/services/viem/viem`
  - All calls are made via RPC to blockchain nodes
  - Uses multicall for efficient batching

---

## Performance Optimization

### Multicall Batching

The algorithm uses **2 multicall batches** instead of individual calls:

1. **Batch 1**: Token decimals + 3 pool address lookups (4 calls → 1 RPC round trip)
2. **Batch 2**: 4 pool data reads × N valid pools (4N calls → 1 RPC round trip)

**Before optimization**: ~13+ individual RPC calls  
**After optimization**: 2 RPC round trips

---

## Supported Chains

Automatically supports any chain with:

- ✅ Uniswap V3 Factory deployed
- ✅ USDC address configured in `usdc-addresses.ts`

Currently configured:

- Mainnet (Ethereum)
- Optimism
- Arbitrum
- Base
- Polygon

---

## Error Handling

- **No USDC for chain**: Throws error if chain not configured
- **No pools found**: Throws error if no token/USDC pools exist across all fee tiers
- **Invalid token address**: ERC-20 decimals call will fail

---

## Price Accuracy

The price accuracy depends on:

- **Pool liquidity**: Higher liquidity = more accurate price
- **Price impact**: Very large trades may deviate from spot price
- **Pool fee tier**: Different fee tiers may have slightly different prices

For most use cases (displaying balances, portfolio values), this provides sufficient accuracy.

---

## Example: Price Calculation for a TKN token

Given:

- Tick: `-276324` (from pool's `slot0`)
- Token decimals: `18` (TKN)
- USDC decimals: `6`

**Calculation**:

```
price = 1.0001^(-276324) * 10^(18 - 6)
price = 1.0001^(-276324) * 10^12
price ≈ 43250.25 USDC per token
```

This represents the price of 1 token (e.g., 1 TKN) in USD.
