import UniswapV3FactoryABI from "@/services/api/lib/vault-metrics/abis/uniswap-v3-factory.json";
import UniswapV3PoolABI from "@/services/api/lib/vault-metrics/abis/uniswap-v3-pool.json";
import IERC20ABI from "@/services/lagoon/abis/IERC20-rescue.json";
import { publicClient } from "@/services/viem/viem";
import { UNISWAP_V3_FACTORY, USDC_BY_CHAIN } from "@/shared/config/usdc-addresses";
import { getContract } from "viem";

const FEE_TIERS = [500, 3000, 10000] as const;

function tickToPrice(tick: number, dec0: number, dec1: number) {
  return Math.pow(1.0001, tick) * 10 ** (dec0 - dec1);
}

export async function getUsdPrice({ chainId, token }: { chainId: number; token: `0x${string}` }) {
  const USDC = USDC_BY_CHAIN[chainId];
  if (!USDC) throw new Error(`No USDC configured for chainId ${chainId}`);

  const tokenDecimals = Number(
    await getContract({ address: token, abi: IERC20ABI, client: publicClient }).read.decimals(),
  );
  const usdcDecimals = 6;

  const factory = getContract({
    address: UNISWAP_V3_FACTORY,
    abi: UniswapV3FactoryABI,
    client: publicClient,
  });

  const [A, B] = token.toLowerCase() < USDC.toLowerCase() ? [token, USDC] : [USDC, token];

  const pools = await Promise.all(
    FEE_TIERS.map(async (fee) => {
      const addr = await factory.read.getPool([A, B, fee]);
      if (addr === "0x0000000000000000000000000000000000000000") return null;
      const pool = getContract({
        address: addr as `0x${string}`,
        abi: UniswapV3PoolABI,
        client: publicClient,
      });
      const [liq, token0, token1, slot0Raw] = await Promise.all([
        pool.read.liquidity(),
        pool.read.token0(),
        pool.read.token1(),
        pool.read.slot0(),
      ]);
      const slot0 = slot0Raw as readonly [bigint, number, number, number, number, number, boolean];
      return {
        addr: addr as `0x${string}`,
        fee,
        liquidity: BigInt(liq as bigint),
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
