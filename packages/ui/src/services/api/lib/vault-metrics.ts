import { formatToFourDecimals } from "@/shared/utils";

function computeVaultMetrics(snapshots: any[]) {
  if (!snapshots.length) return { netApy: 0, netApy30d: 0, sharpe: 0 };

  // Sort chronologically
  const sorted = [...snapshots].sort(
    (a, b) => new Date(a.event_timestamp).getTime() - new Date(b.event_timestamp).getTime(),
  );

  // ---- 1) Net APY (time-weighted) ----
  const totalWeightedApy = sorted.reduce((acc, s) => acc + (s.apy || 0) * (s.delta_hours || 0), 0);
  const totalHours = sorted.reduce((acc, s) => acc + (s.delta_hours || 0), 0);
  const netApy = totalHours > 0 ? totalWeightedApy / totalHours : 0;

  // ---- 2) 30-day Net APY (compounded from share_price) ----
  const latest = sorted.at(-1)!;
  const thirtyDaysAgo = new Date(latest.event_timestamp).getTime() - 30 * 24 * 3600 * 1000;
  const snapshot30 =
    sorted.find((s) => new Date(s.event_timestamp).getTime() >= thirtyDaysAgo) || sorted[0];
  const netApy30d =
    snapshot30 && latest.share_price && snapshot30.share_price
      ? Math.pow(latest.share_price / snapshot30.share_price, 365 / 30) - 1
      : 0;

  // ---- 3) Sharpe Ratio ----
  const returns: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    //const prev = sorted[i - 1];
    const curr = sorted[i];
    const hours = curr.delta_hours || 0;
    const apy = curr.apy || 0;
    const r = Math.exp(apy * (hours / 8760)) - 1;
    if (!isNaN(r)) returns.push(r);
  }

  const mean = returns.reduce((a, b) => a + b, 0) / (returns.length || 1);
  const variance = returns.reduce((s, r) => s + (r - mean) ** 2, 0) / (returns.length - 1 || 1);
  const sigma = Math.sqrt(Math.max(variance, 0));

  const avgDelta = totalHours / Math.max(returns.length, 1);
  const annualFactor = 8760 / avgDelta;
  const sharpe = sigma > 0 ? (mean * annualFactor) / (sigma * Math.sqrt(annualFactor)) : 0;

  const netApyFormatted = formatToFourDecimals(netApy);
  const netApy30dFormatted = formatToFourDecimals(netApy30d);
  const sharpeFormatted = formatToFourDecimals(sharpe);

  return { netApy: netApyFormatted, netApy30d: netApy30dFormatted, sharpe: sharpeFormatted };
}

interface snapshotsResponse {
  total: number;
  next_offset: number;
  snapshots: any[];
}

export function computeVaultMetricsByVaultId(snapshots: snapshotsResponse) {
  if (!snapshots || !snapshots.snapshots || !snapshots["snapshots"].length)
    return [{ vaultId: "", netApy: 0, netApy30d: 0, sharpe: 0 }];

  let sorted = [...snapshots.snapshots].sort(
    (a, b) => new Date(a.event_timestamp).getTime() - new Date(b.event_timestamp).getTime(),
  );

  sorted = sorted.reduce((acc, s) => {
    if (acc[s.vault_id]) {
      acc[s.vault_id].push(s);
    } else {
      acc[s.vault_id] = [s];
    }
    return acc;
  }, {});
  const vaultSnapshots = Object.values(sorted);

  return vaultSnapshots.map((vaultSnapshots) => {
    const vm = computeVaultMetrics(vaultSnapshots);
    return {
      vaultId: vaultSnapshots[0].vault_id,
      ...vm,
    };
  });
}
