import { VaultCalculations } from "./use-vault-calculations";

export interface PortfolioTotals {
  tvl: number;
  yieldEarned: number;
  deposited: number;
}

export function usePortfolioTotals(vaultCalculations: VaultCalculations): PortfolioTotals {
  return {
    tvl: vaultCalculations.totalPositionValue,
    yieldEarned: vaultCalculations.totalYieldEarned,
    deposited: vaultCalculations.totalTotalAssets,
  };
}
