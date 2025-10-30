import IERC20ABI from "@/services/lagoon/abis/IERC20-rescue.json";
import UniswapV3FactoryABI from "@/services/uniswap/abis/uniswap-v3-factory.json";
import UniswapV3PoolABI from "@/services/uniswap/abis/uniswap-v3-pool.json";
import { publicClient } from "@/services/viem/viem";
import { UNISWAP_V3_FACTORY, USDC_BY_CHAIN } from "@/shared/config/usdc-addresses";
import type { Abi, Address, MulticallParameters } from "viem";

const FEE_TIERS = [500, 3000, 10000] as const;

function tickToPrice(tick: number, dec0: number, dec1: number) {
  return Math.pow(1.0001, tick) * 10 ** (dec0 - dec1);
}

export async function getUsdPrice({ chainId, token }: { chainId: number; token: `0x${string}` }) {
  const USDC = USDC_BY_CHAIN[chainId];
  if (!USDC) throw new Error(`No USDC configured for chainId ${chainId}`);

  const [A, B] = token.toLowerCase() < USDC.toLowerCase() ? [token, USDC] : [USDC, token];
  const usdcDecimals = 6;

  // Multicall 1: Get token decimals and all pool addresses
  const multicall1: MulticallParameters["contracts"] = [
    {
      address: token,
      abi: IERC20ABI as Abi,
      functionName: "decimals",
      args: [],
    },
    ...FEE_TIERS.map((fee) => ({
      address: UNISWAP_V3_FACTORY as Address,
      abi: UniswapV3FactoryABI as Abi,
      functionName: "getPool" as const,
      args: [A, B, fee],
    })),
  ];

  const results1 = await publicClient.multicall({
    contracts: multicall1,
    allowFailure: false,
  });

  const tokenDecimals = Number(results1[0]);
  const poolAddresses = results1.slice(1) as Address[];

  // Filter valid pools and prepare pool data multicall
  const validPools: Array<{ address: Address; fee: number; index: number }> = [];
  poolAddresses.forEach((addr, idx) => {
    if (addr !== "0x0000000000000000000000000000000000000000") {
      validPools.push({ address: addr, fee: FEE_TIERS[idx]!, index: idx });
    }
  });

  if (validPools.length === 0) throw new Error("No USDC pool found");

  // Multicall 2: Get all pool data (liquidity, token0, token1, slot0) for valid pools
  const multicall2: MulticallParameters["contracts"] = validPools.flatMap((pool) => [
    {
      address: pool.address,
      abi: UniswapV3PoolABI as Abi,
      functionName: "liquidity",
      args: [],
    },
    {
      address: pool.address,
      abi: UniswapV3PoolABI as Abi,
      functionName: "token0",
      args: [],
    },
    {
      address: pool.address,
      abi: UniswapV3PoolABI as Abi,
      functionName: "token1",
      args: [],
    },
    {
      address: pool.address,
      abi: UniswapV3PoolABI as Abi,
      functionName: "slot0",
      args: [],
    },
  ]);

  const results2 = await publicClient.multicall({
    contracts: multicall2,
    allowFailure: false,
  });

  // Process pool data
  const pools = validPools.map((pool, idx) => {
    const baseIdx = idx * 4;
    const liq = results2[baseIdx] as bigint;
    const token0 = results2[baseIdx + 1] as Address;
    const token1 = results2[baseIdx + 2] as Address;
    const slot0Raw = results2[baseIdx + 3];
    const slot0 = slot0Raw as readonly [bigint, number, number, number, number, number, boolean];

    return {
      addr: pool.address,
      fee: pool.fee,
      liquidity: BigInt(liq),
      token0,
      token1,
      tick: Number(slot0[1]),
    };
  });

  // Sort by liquidity and pick best
  const candidates = pools.sort((a, b) => (a.liquidity < b.liquidity ? 1 : -1));
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
