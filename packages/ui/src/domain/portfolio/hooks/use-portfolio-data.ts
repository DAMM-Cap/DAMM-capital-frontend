import { useVaults } from "@/context/vault-context";
import { VaultMetricsView, VaultsDataView } from "@/services/api/types/data-presenter";
import { useUserPosition } from "@/services/api/use-user-position";
import { useOperationStateQuery } from "@/services/lagoon/use-operation-state";
import { formatToMaxDefinition } from "@/shared/utils";
import { useEffect, useState } from "react";

export enum OperationStatus {
  CONFIRMED = "Confirmed",
  DEPOSIT_PENDING = "Deposit Pending",
  WITHDRAW_PENDING = "Withdraw Pending",
  SHARES_CLAIMABLE = "Shares Claimable",
  ASSETS_CLAIMABLE = "Assets Claimable",
}

export function usePortfolioData(vaultId?: string) {
  const { vaults, isLoading } = useVaults();
  const [selectedVault, setSelectedVault] = useState<VaultsDataView | undefined>(undefined);

  const { data: userPosition } = useUserPosition();

  const [vaultsData, setVaultsData] = useState<
    Record<string, Record<"positionValue" | "totalAssets" | "yieldEarned", number>>
  >({});

  const [totalPositionValue, setTotalPositionValue] = useState<number>(0);
  const [totalTotalAssets, setTotalTotalAssets] = useState<number>(0);
  const [totalYieldEarned, setTotalYieldEarned] = useState<number>(0);

  const [selectedVaultMetrics, setSelectedVaultMetrics] = useState<VaultMetricsView | undefined>(
    undefined,
  );

  useEffect(() => {
    if (vaultId && vaults?.vaultsData && vaults?.vaultMetrics) {
      const foundVault = vaults.vaultsData.find((v) => v.staticData.vault_id === vaultId);
      setSelectedVault(foundVault);

      const foundVaultMetrics = vaults.vaultMetrics.find((v) => v.vaultId === vaultId);
      setSelectedVaultMetrics(foundVaultMetrics);
    }
  }, [vaultId, vaults]);

  const opState = useOperationStateQuery(
    selectedVault?.staticData.vault_address,
    selectedVault?.staticData.token_decimals,
  );

  useEffect(() => {
    let totalPositionValue = 0;
    let totalTotalAssets = 0;
    let totalYieldEarned = 0;
    userPosition?.forEach((vaultUserPositionData) => {
      const selectedVault = vaults?.vaultsData.find(
        (v) => v.staticData.vault_id === vaultUserPositionData.vault_id,
      );
      if (!selectedVault) return;

      const positionValue =
        (Number(vaultUserPositionData.user_total_shares) *
          Number(vaultUserPositionData.share_price) *
          10 ** selectedVault.staticData.token_decimals) /
        10 ** selectedVault.staticData.vault_decimals;
      totalPositionValue += positionValue;

      const totalAssets =
        Number(vaultUserPositionData.total_assets) / 10 ** selectedVault.staticData.token_decimals;
      totalTotalAssets += totalAssets;

      const yieldEarned = positionValue - totalAssets;
      totalYieldEarned += yieldEarned;

      setVaultsData((prevVaultsData) => ({
        ...prevVaultsData,
        [vaultUserPositionData.vault_id as string]: {
          positionValue: formatToMaxDefinition(positionValue),
          totalAssets: formatToMaxDefinition(totalAssets),
          yieldEarned: formatToMaxDefinition(yieldEarned),
        },
      }));
    });
    setTotalPositionValue(formatToMaxDefinition(totalPositionValue));
    setTotalTotalAssets(formatToMaxDefinition(totalTotalAssets));
    setTotalYieldEarned(formatToMaxDefinition(totalYieldEarned));
  }, [userPosition, vaults]);

  function useFundData() {
    if (!selectedVault) {
      return {
        vault_name: "",
        apr: "0",
        vault_icon: "",
        token_symbol: "",
        positionSize: "0",
        yieldEarned: "0",
        operation: "",
        operationVariant: "outline-secondary",
        operationActive: false,
      };
    }

    let operation = OperationStatus.CONFIRMED;
    let operationVariant = "outline-secondary";
    if (opState.pendingDepositRequest > 0) {
      operation = OperationStatus.DEPOSIT_PENDING;
      operationVariant = "outline-secondary";
    }
    if (opState.pendingRedeemRequest > 0) {
      operation = OperationStatus.WITHDRAW_PENDING;
      operationVariant = "outline-secondary";
    }
    if (opState.claimableDepositRequest > 0) {
      operation = OperationStatus.SHARES_CLAIMABLE;
      operationVariant = "outline";
    }
    if (opState.claimableRedeemRequest > 0) {
      operation = OperationStatus.ASSETS_CLAIMABLE;
      operationVariant = "outline";
    }

    return {
      vault_name: selectedVault.staticData.vault_name,
      apr: selectedVaultMetrics?.netApy ?? 0,
      positionSize: vaultsData[selectedVault.staticData.vault_id]?.positionValue ?? 0,
      yieldEarned: vaultsData[selectedVault.staticData.vault_id]?.yieldEarned ?? 0,
      vault_icon: selectedVault.staticData.vault_icon,
      token_symbol: selectedVault.staticData.token_symbol,
      operation: operation,
      operationVariant: operationVariant,
      operationActive: operation !== OperationStatus.CONFIRMED,
    };
  }

  function usePortfolioSingleValuesData() {
    return {
      tvl: totalPositionValue,
      yieldEarned: totalYieldEarned,
      deposited: totalTotalAssets,
    };
  }

  return {
    useFundData,
    usePortfolioSingleValuesData,
    vaultIds: vaults?.vaultsData?.map((fund) => fund.staticData.vault_id),
    isLoading: isLoading,
  };
}
