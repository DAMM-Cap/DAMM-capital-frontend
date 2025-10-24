import { OperationStatus } from "../hooks/use-operation-status";
import { VaultCalculationData } from "../hooks/use-vault-calculations";
import { Vault, VaultMetrics } from "@/shared/types";

export interface FundData {
  vault_name: string;
  apr: number;
  vault_icon: string;
  token_symbol: string;
  positionSize: number;
  yieldEarned: number;
  totalAssets: number;
  operation: OperationStatus;
  operationVariant: "outline-secondary" | "outline";
  operationActive: boolean;
}

export function getFundData(
  vaultId: string | undefined,
  vaults: Vault[],
  metrics: VaultMetrics[],
  vaultCalculations: Record<string, VaultCalculationData>,
  operationStates: Record<string, any>
): FundData {
  const selectedVault = vaults.find((v) => v.id === vaultId);
  const selectedVaultMetrics = metrics.find((v) => v.vaultId === vaultId);
  const operationState = operationStates[vaultId || ""];
  const vaultCalculation = vaultCalculations[vaultId || ""];

  if (!selectedVault || !operationState) {
    return {
      vault_name: "",
      apr: 0,
      vault_icon: "",
      token_symbol: "",
      positionSize: 0,
      yieldEarned: 0,
      totalAssets: 0,
      operation: OperationStatus.CONFIRMED,
      operationVariant: "outline-secondary",
      operationActive: false,
    };
  }

  return {
    vault_name: selectedVault.name,
    vault_icon: selectedVault.icon,
    token_symbol: selectedVault.tokenSymbol,

    apr: selectedVaultMetrics?.netApy ?? 0,

    positionSize: vaultCalculation?.positionValue ?? 0,
    yieldEarned: vaultCalculation?.yieldEarned ?? 0,
    totalAssets: vaultCalculation?.totalAssets ?? 0,

    operation: operationState.operation,
    operationVariant: operationState.operationVariant,
    operationActive: operationState.operationActive,
  };
}
