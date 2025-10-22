import { IntegratedPosition } from "./integrated-position-converter";

/**
 * Modifies rows in place:
 * - If a token_symbol maps to >1 distinct token_address, suffix only the 2nd+ occurrences:
 *   "USDC", "USDC(1)", "USDC(2)", ...
 * - If a token_symbol maps to exactly 1 address (even if repeated rows), no suffixes are added.
 * - Case-insensitive on both token_symbol and token_address.
 */
export function tokenSymbolsWithSuffix(rows: IntegratedPosition[]) {
  // 1) Collect distinct addresses per symbol
  const addrBySymbol: Record<string, Set<string>> = {};

  for (const r of rows) {
    const sym = r.token_symbol.toUpperCase();
    const addr = r.token_address.toLowerCase();
    (addrBySymbol[sym] ??= new Set<string>()).add(addr);
  }

  // 2) Walk again; only suffix symbols that collide across multiple addresses
  const seenBySymbol: Record<string, number> = {};

  for (const r of rows) {
    const symKey = r.token_symbol.toUpperCase();
    const hasCollision = (addrBySymbol[symKey]?.size ?? 0) > 1;

    if (!hasCollision) continue; // symbol maps to a single address -> no changes

    const idx = (seenBySymbol[symKey] = (seenBySymbol[symKey] ?? 0) + 1);
    if (idx > 1) {
      r.token_symbol = `${r.token_symbol}(${idx - 1})`;
    }
  }
}
