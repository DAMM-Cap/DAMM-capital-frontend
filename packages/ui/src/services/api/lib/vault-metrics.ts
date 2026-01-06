import { formatToMaxDefinition } from "@/shared/utils";
import { VaultMetricsResponse } from "../types/vault-data";

/** ───────────────────────── Types ───────────────────────── */

interface FetchedSnapshotData {
  apy: number;
  chain_id: number;
  delta_hours: number;
  deposit_token_address: string;
  deposit_token_decimals: number;
  deposit_token_symbol: string;
  entrance_rate: number | null;
  event_id: string;
  event_timestamp: string;
  exit_rate: number | null;
  management_fee: number | null;
  performance_fee: number | null;
  share_price: number;
  total_assets: number;
  total_shares: number;
  vault_id: string;
  vault_name: string;
  vault_token_address: string;
  vault_token_decimals: number;
  vault_token_symbol: string;
}

interface ApiSnapshotsResponse {
  total: number;
  next_offset: number;
  snapshots: FetchedSnapshotData[];
}

/**
 * Minimal per-interval fields needed for APY math, AUM and NAV calculation.
 */
type VaultMetricsData =
  Pick<FetchedSnapshotData,
    "vault_id" | "event_timestamp" | "apy" | "delta_hours" | 
    "share_price" | "total_assets" | "deposit_token_decimals" | 
    "total_shares" | "management_fee" | "performance_fee"
  >;

/** ─────────────────── Math / Stats helpers ─────────────────── */

/**
 * log(1 + x) with a small floor to avoid -Inf when (1 + apy) ~ 0
 * This stabilizes very negative APY intervals.
 */
function safeLog1p(x: number): number {
  const y = 1 + x;
  const EPS = 1e-12;
  return Math.log(Math.max(y, EPS));
}

function stddev(xs: number[]): number {
  if (xs.length <= 1) return 0;
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  const var_ =
    xs.reduce((s, v) => s + (v - mean) * (v - mean), 0) / (xs.length - 1);
  return Math.sqrt(var_);
}

/** 
 * Normalize APY from percentage to fraction.
 * Backend always returns APY as a percentage (e.g., 2.77 means 2.77%), so we always divide by 100.
 * */
function normalizeApy(apy: number): number {
  if (!Number.isFinite(apy)) return 0;
  return apy / 100;
}


/** ───────────────────── NAV / AUM helpers ─────────────────────
 * Units:
 * - total_assets, management_fee, performance_fee are in smallest units (e.g., USDT * 10^6)
 * - share_price * total_shares also yields smallest units
 * - priceUSD defaults to 1 for stables; swap with an oracle if needed
 */

/** NAV (USD, net of fees): (total_assets − management_fee − performance_fee) */
function computeNavUsdFromSnapshotUsingFees(
  s: Pick<FetchedSnapshotData,
    "total_assets" | "management_fee" | "performance_fee" | "deposit_token_decimals"
  >,
  priceUSD: number = 1
): number {
  const mgmt = Number.isFinite(s.management_fee ?? 0) ? (s.management_fee as number) : 0;
  const perf = Number.isFinite(s.performance_fee ?? 0) ? (s.performance_fee as number) : 0;
  const netSmallest = Math.max(s.total_assets - mgmt - perf, 0);
  const netTokens = netSmallest / 10 ** s.deposit_token_decimals;
  return netTokens * priceUSD;
}

/** AUM (USD, gross): total_shares × share_price (no fee deduction) */
function computeAumUsdFromShares(
  s: Pick<FetchedSnapshotData, "total_shares" | "share_price" | "deposit_token_decimals">,
  priceUSD: number = 1
): number {
  const totalAssetsSmallest = s.share_price * s.total_shares;
  const assetsTokens = totalAssetsSmallest / 10 ** s.deposit_token_decimals;
  return assetsTokens * priceUSD;
}


/** ───────────────────── Main metrics ─────────────────────
 * netApy     = annualized return implied by the compounded growth across all intervals
 *              (independent of totalHours window length)
 * netApy30d  = productFactor^(720 / totalHours) - 1  (30-day normalization)
 * sharpe     = (mean_daily / std_daily) * sqrt(365), using dailyized interval returns
 * aum        = latest snapshot AUM in USD (stable ~= $1)
 */
function computeVaultMetrics(
  vaultId: string,
  snapshots: VaultMetricsData[]
): VaultMetricsResponse {
  if (!snapshots.length)
    return { vaultId: "", netApy: 0, netApy30d: 0, sharpe: 0, aum: 0, nav: 0, lastSnapshotTimestamp: "" };

  // 1) Sort by timestamp ascending to respect time order
  const data = [...snapshots].sort(
    (a, b) =>
      new Date(a.event_timestamp).getTime() - new Date(b.event_timestamp).getTime()
  );

  // 2) Calculate AUM / NAV from the latest snapshot FIRST
  // These metrics should always be available regardless of APY data
  const latest = data[data.length - 1]!;
  const priceUSD = 1; // For non-stable coins, get the correct price from API
  
  // AUM = GROSS (no fee deduction): shares * share_price
  let aumUSD = 0;
  if (
    typeof latest.total_shares === "number" &&
    typeof latest.share_price === "number" &&
    typeof latest.deposit_token_decimals === "number"
  ) {
    aumUSD = computeAumUsdFromShares(
      {
        total_shares: latest.total_shares,
        share_price: latest.share_price,
        deposit_token_decimals: latest.deposit_token_decimals,
      },
      priceUSD
    );
  }

  // NAV = NET (subtract accrued fee amounts already present in the snapshot)
  let navUSD = 0;
  if (
    typeof latest.total_assets === "number" &&
    typeof latest.deposit_token_decimals === "number"
  ) {
    navUSD = computeNavUsdFromSnapshotUsingFees(
      {
        total_assets: latest.total_assets,
        management_fee: latest.management_fee,
        performance_fee: latest.performance_fee ?? 0,
        deposit_token_decimals: latest.deposit_token_decimals,
      },
      priceUSD
    );
  }

  // 3) Accumulate interval log-growth and total hours for APY/Sharpe calculation
  // interval_factor_i = (1 + apy_i)^(delta_t_i/8760)
  // product_factor    = product of interval_factor_i = exp( sum (delta_t_i/8760) * ln(1+apy_i) )
  let sumLog = 0;           // sum (delta_t/8760) * ln(1 + apy)
  let totalHours = 0;       // sum delta_t
  const dailyizedReturns: number[] = []; // for Sharpe

  for (const s of data) {
    // Skip if APY missing or dt <= 0
    const dt = Math.max(0, s.delta_hours ?? 0);
    if (dt <= 0 || s.apy == null) continue;

    // Normalize APY to fraction, then clamp just above -1 for stability.
    // (Optional) also cap absurd positive APYs to avoid overflow explosions.
    const apyNorm = normalizeApy(s.apy);
    if (!Number.isFinite(apyNorm)) continue;
    const a = Math.min(Math.max(apyNorm, -0.999999999), 10); // cap upper to 10 (~1000% annual)

    sumLog += (dt / 8760) * safeLog1p(a);
    totalHours += dt;

    // Per-interval realized return over dt hours:
    // r_i = (1 + apy)^(delta_t/8760) - 1
    const intervalFactor = Math.exp((dt / 8760) * safeLog1p(a));
    const r_i = intervalFactor - 1;

    // Dailyize this interval return to a 24h horizon (skip ultra-tiny windows)
    if (dt > 0.25) {
      // d_i = (1 + r_i)^(24/dt) - 1
      const d_i = Math.pow(1 + r_i, 24 / dt) - 1;
      if (Number.isFinite(d_i)) dailyizedReturns.push(d_i);
    }
  }

  // If no valid APY intervals, return with AUM/NAV but zero APY/Sharpe
  if (totalHours <= 0) {
    return { 
      vaultId, 
      netApy: 0, 
      netApy30d: 0, 
      sharpe: 0, 
      aum: formatToMaxDefinition(aumUSD), 
      nav: formatToMaxDefinition(navUSD), 
      lastSnapshotTimestamp: latest.event_timestamp 
    };
  }

  // 4) Annualized implied return from the observed window
  // product_factor = exp(sumLog)
  const productFactor = Math.exp(sumLog);
  // Annualize from totalHours -> hours/year = 8760
  const netApy = Math.pow(productFactor, 8760 / totalHours) - 1;

  // 5) Calculate 30-day APY from snapshots in the last 30 days only
  const thirtyDaysAgo = new Date(latest.event_timestamp);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  let sumLog30d = 0;
  let totalHours30d = 0;
  
  for (const s of data) {
    const snapshotDate = new Date(s.event_timestamp);
    if (snapshotDate < thirtyDaysAgo) continue; // Skip snapshots older than 30 days
    
    const dt = Math.max(0, s.delta_hours ?? 0);
    if (dt <= 0 || s.apy == null) continue;
    
    const apyNorm = normalizeApy(s.apy);
    if (!Number.isFinite(apyNorm)) continue;
    const a = Math.min(Math.max(apyNorm, -0.999999999), 10);
    
    sumLog30d += (dt / 8760) * safeLog1p(a);
    totalHours30d += dt;
  }
  
  let netApy30d = 0;
  if (totalHours30d > 0) {
    const productFactor30d = Math.exp(sumLog30d);
    // Annualize from totalHours30d -> hours/year = 8760
    netApy30d = Math.pow(productFactor30d, 8760 / totalHours30d) - 1;
  }

  // 6) Sharpe using dailyized interval returns, risk-free ~ 0
  // Sharpe_ann = (mean_daily / std_daily) * sqrt(365)
  let sharpe = 0;
  if (dailyizedReturns.length >= 2) {
    const mean = dailyizedReturns.reduce((a, b) => a + b, 0) / dailyizedReturns.length;
    const sd = stddev(dailyizedReturns);
    if (sd > 0) {
      sharpe = (mean / sd) * Math.sqrt(365);
    }
  }

  return {
    vaultId,
    netApy: formatToMaxDefinition(netApy),
    netApy30d: formatToMaxDefinition(netApy30d),
    sharpe: formatToMaxDefinition(sharpe),
    aum: formatToMaxDefinition(aumUSD),
    nav: formatToMaxDefinition(navUSD),
    lastSnapshotTimestamp: latest.event_timestamp,
  };
}

export function computeVaultMetricsByVaultId(snapshots: ApiSnapshotsResponse): VaultMetricsResponse[] {
  if (!snapshots || !snapshots.snapshots || !snapshots["snapshots"].length)
    return [{ vaultId: "", netApy: 0, netApy30d: 0, sharpe: 0, aum: 0, nav: 0, lastSnapshotTimestamp: "" }];

  // Sort once globally by time, then bucket
  const sorted: VaultMetricsData[] = [...snapshots.snapshots].sort(
    (a, b) => new Date(a.event_timestamp).getTime() - new Date(b.event_timestamp).getTime(),
  );

  interface SortedByVaultId {
    [vaultId: string]: VaultMetricsData[];
  }

  const sortedByVaultId: SortedByVaultId = sorted.reduce((acc, s) => {
    (acc[s.vault_id] ??= []).push(s);
    return acc;
  }, {} as SortedByVaultId);

  const resultingMetrics: VaultMetricsResponse[] = Object
    .entries(sortedByVaultId)
    .map(([vaultId, vaultSnapshots]) => computeVaultMetrics(vaultId, vaultSnapshots));

  return resultingMetrics;
}
