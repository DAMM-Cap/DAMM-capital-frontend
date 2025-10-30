import { arbitrum, base, mainnet, optimism, polygon } from "viem/chains";

export const USDC_BY_CHAIN: Record<number, `0x${string}`> = {
  [mainnet.id]: "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  [optimism.id]: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
  [arbitrum.id]: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  [base.id]: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  // Polygon note: liquidity often sits on USDC.e (0x2791…); adjust if needed:
  [polygon.id]: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC.e
};

export const UNISWAP_V3_FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
