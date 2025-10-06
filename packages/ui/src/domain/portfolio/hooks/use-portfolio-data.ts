import { useVaults } from "@/context/vault-context";
import { VaultsDataView } from "@/services/api/types/data-presenter";
import { useEffect, useState } from "react";

export function usePortfolioData(vaultId?: string) {
  const { vaults, isLoading } = useVaults();
  const [selectedVault, setSelectedVault] = useState<VaultsDataView | undefined>(undefined);

  useEffect(() => {
    if (vaultId && vaults?.vaultsData) {
      const foundVault = vaults.vaultsData.find((v) => v.staticData.vault_id === vaultId);
      setSelectedVault(foundVault);
    }
  }, [vaultId, vaults]);

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
      };
    }
    return {
      vault_name: selectedVault.staticData.vault_name,
      apr: selectedVault.vaultData.apr,
      positionSize: selectedVault.vaultData.positionRaw,
      yieldEarned:
        selectedVault.vaultData.positionRaw * selectedVault.vaultData.sharePrice -
        selectedVault.vaultData.positionRaw,
      vault_icon: selectedVault.staticData.vault_icon,
      token_symbol: selectedVault.staticData.token_symbol,
      operation: "Shares Claimable",
      operationVariant: "outline",
    };
  }

  function usePortfolioSingleValuesData() {
    const { tvl, yieldEarned, deposited } = vaults?.vaultsData
      ?.map((fund) => ({
        tvl: fund.vaultData.positionRaw * fund.vaultData.sharePrice,
        yieldEarned:
          fund.vaultData.positionRaw * fund.vaultData.sharePrice - fund.vaultData.positionRaw,
        deposited: fund.vaultData.positionRaw,
      }))
      .reduce(
        (acc, curr) => ({
          tvl: Number(acc.tvl) + Number(curr.tvl),
          yieldEarned: Number(acc.yieldEarned) + Number(curr.yieldEarned),
          deposited: Number(acc.deposited) + Number(curr.deposited),
        }),
        { tvl: 0, yieldEarned: 0, deposited: 0 },
      ) ?? { tvl: 0, yieldEarned: 0, deposited: 0 };
    return {
      tvl,
      yieldEarned,
      deposited,
    };
  }

  return {
    useFundData,
    usePortfolioSingleValuesData,
    vaultIds: vaults?.vaultsData?.map((fund) => fund.staticData.vault_id),
    isLoading: isLoading,
  };
}
