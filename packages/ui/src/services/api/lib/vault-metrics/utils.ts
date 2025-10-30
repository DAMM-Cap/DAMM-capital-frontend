import UniswapV3FactoryABI from "@/services/api/lib/vault-metrics/abis/uniswap-v3-factory.json";
import IERC20 from "@/services/lagoon/abis/IERC20-rescue.json";
import { publicClient } from "@/services/viem/viem";
import type { Abi } from "viem";
import { getContract } from "viem";
import { arbitrum, base, mainnet, optimism, polygon } from "viem/chains";

const UNISWAP_V3_FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
const FEE_TIERS = [500, 3000, 10000] as const;

// Native USDCs (pick what has liquidity on your chain)
const USDC_BY_CHAIN: Record<number, `0x${string}`> = {
  [mainnet.id]: "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  [optimism.id]: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
  [arbitrum.id]: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  [base.id]: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  // Polygon note: liquidity often sits on USDC.e (0x2791…); adjust if needed:
  [polygon.id]: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC.e
};

const V3_FACTORY_MIN = [
  {
    type: "function",
    name: "getPool",
    stateMutability: "view",
    inputs: [
      { name: "tokenA", type: "address" },
      { name: "tokenB", type: "address" },
      { name: "fee", type: "uint24" },
    ],
    outputs: [{ type: "address" }],
  },
] as const;

const V3_POOL_MIN = [
  {
    type: "function",
    name: "token0",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
  {
    type: "function",
    name: "token1",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
  {
    type: "function",
    name: "liquidity",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint128" }],
  },
  {
    type: "function",
    name: "slot0",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "sqrtPriceX96", type: "uint160" },
      { name: "tick", type: "int24" },
      { type: "uint16" },
      { type: "uint16" },
      { type: "uint16" },
      { type: "uint8" },
      { type: "bool" },
    ],
  },
] as const;

const CHAIN_BY_ID: Record<number, any> = {
  [mainnet.id]: mainnet,
  [optimism.id]: optimism,
  [arbitrum.id]: arbitrum,
  [base.id]: base,
  [polygon.id]: polygon,
};

function tickToPrice(tick: number, dec0: number, dec1: number) {
  return Math.pow(1.0001, tick) * 10 ** (dec0 - dec1);
}

export async function getUsdPrice({ chainId, token }: { chainId: number; token: `0x${string}` }) {
  const chain = CHAIN_BY_ID[chainId];
  if (!chain) throw new Error(`Unsupported chainId ${chainId}`);
  const USDC = USDC_BY_CHAIN[chainId];
  if (!USDC) throw new Error(`No USDC configured for chainId ${chainId}`);

  const tokenDecimals = Number(
    await getContract({ address: token, abi: IERC20, client: publicClient }).read.decimals(),
  );
  const usdcDecimals = 6;

  const factory = getContract({
    address: UNISWAP_V3_FACTORY,
    abi: V3_FACTORY_MIN,
    //abi: UniswapV3FactoryABI as Abi,
    client: publicClient,
  });

  const [A, B] = token.toLowerCase() < USDC.toLowerCase() ? [token, USDC] : [USDC, token];

  const pools = await Promise.all(
    FEE_TIERS.map(async (fee) => {
      const addr = await factory.read.getPool([A, B, fee]);
      if (addr === "0x0000000000000000000000000000000000000000") return null;
      const pool = getContract({ address: addr, abi: V3_POOL_MIN, client: publicClient });
      const [liq, token0, token1, slot0] = await Promise.all([
        pool.read.liquidity(),
        pool.read.token0(),
        pool.read.token1(),
        pool.read.slot0(),
      ]);
      return {
        addr: addr as `0x${string}`,
        fee,
        liquidity: BigInt(liq),
        token0: token0 as `0x${string}`,
        token1: token1 as `0x${string}`,
        tick: Number(slot0[1]),
      };
    }),
  );

  const candidates = (pools.filter(Boolean) as (typeof pools)[number][]).sort((a, b) =>
    a!.liquidity < b!.liquidity ? 1 : -1,
  );
  if (candidates.length === 0) throw new Error("No USDC pool found");

  const best = candidates[0]!;
  const tokenIs0 = best.token0.toLowerCase() === token.toLowerCase();
  const p = tickToPrice(
    best.tick,
    tokenIs0 ? tokenDecimals : usdcDecimals,
    tokenIs0 ? usdcDecimals : tokenDecimals,
  );
  const usd = tokenIs0 ? p : 1 / p;

  return { usd, pool: best.addr, feeTierBps: best.fee, liquidity: best.liquidity.toString() };
}
