import { FundData, getFundData } from "../utils/fund-data-utils";
import { useOperationStatus } from "./use-operation-status";
import { usePortfolioTotals } from "./use-portfolio-totals";
import { useVaultCalculations } from "@/domain/portfolio/hooks/use-vault-calculations";
import { Vault, VaultMetrics } from "@/shared/types";

export { OperationStatus } from "./use-operation-status";

export function usePortfolioData(vaults: Vault[], metrics: VaultMetrics[]) {
  // Use specialized hooks for different concerns
  const vaultCalculations = useVaultCalculations(vaults);
  const { operationStates } = useOperationStatus(vaults);
  const portfolioTotals = usePortfolioTotals(vaultCalculations);
  
  // Create fund data function for specific vault
  const getFundDataForVault = (targetVaultId?: string) => {
    return getFundData(
      targetVaultId,
      vaults,
      metrics,
      vaultCalculations.vaultsData,
      operationStates
    );
  };

  const vaultsWithPositions = (vaults || []).reduce((acc, vault) => {
    const data = getFundData(vault.id, vaults, metrics, vaultCalculations.vaultsData, operationStates);
    if (Number(data.positionSize) > 0 || data.operationActive) {
      acc.push({
        vault,
        fundData: data,
      });
    }
    return acc;
  }, [] as { vault: Vault, fundData: FundData }[]);

  return {
    getFundData: getFundDataForVault,
    portfolioTotals,
    vaultCalculations,
    operationStates,
    vaultsWithPositions,
  };
}
