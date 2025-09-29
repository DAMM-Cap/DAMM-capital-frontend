import { useVaults } from "@/context/vault-context";
import { VaultsDataView } from "@/services/api/types/data-presenter";
import { useEffect, useState } from "react";

export function useFundOperateData(vaultId: string) {
  const { vaults } = useVaults();
  const [selectedVault, setSelectedVault] = useState<VaultsDataView | undefined>(undefined);

  useEffect(() => {
    if (vaultId && vaults?.vaultsData) {
      const foundVault = vaults.vaultsData.find((v) => v.staticData.vault_id === vaultId);
      setSelectedVault(foundVault);
    }
  }, [vaultId, vaults]);

  function useDepositData() {
    if (!selectedVault) {
      throw new Error("Selected vault not found");
    }
    return {
      position: selectedVault.positionData.totalValueRaw || 0,
      conversionValue: selectedVault.vaultData.sharePrice || 0,
      vault_address: selectedVault.staticData.vault_address,
      token_address: selectedVault.staticData.token_address,
      token_decimals: selectedVault.staticData.token_decimals,
      fee_receiver_address: selectedVault.staticData.fee_receiver_address,
      entranceRate: selectedVault.vaultData.entranceRate,
    };
  }

  function useWithdrawData() {
    if (!selectedVault) {
      throw new Error("Selected vault not found");
    }
    return {
      position: selectedVault.positionData.totalValueRaw || 0,
      conversionValue: selectedVault.vaultData.sharePrice || 0,
      vault_address: selectedVault.staticData.vault_address,
      token_address: selectedVault.staticData.token_address,
      fee_receiver_address: selectedVault.staticData.fee_receiver_address,
      exitRate: selectedVault.vaultData.exitRate,
      availableToRedeemRaw: selectedVault.positionData.availableToRedeemRaw || 0,
      vault_status: selectedVault.staticData.vault_status,
      token_symbol: selectedVault.staticData.token_symbol,
    };
  }

  function useFundData() {
    if (!selectedVault) {
      throw new Error("Selected vault not found");
    }
    return {
      vault_name: selectedVault.staticData.vault_name,
      vault_symbol: selectedVault.staticData.vault_symbol,
      apr: selectedVault.vaultData.apr,
      aprChange: selectedVault.vaultData.aprChange,
      tvl: selectedVault.vaultData.tvl,
      vault_icon: selectedVault.staticData.vault_icon,
      token_symbol: selectedVault.staticData.token_symbol,
      totalValue: selectedVault.positionData.totalValue,
      vaultShare: selectedVault.positionData.vaultShare,
      claimableShares: selectedVault.positionData.claimableShares,
      vault_address: selectedVault.staticData.vault_address,
      token_address: selectedVault.staticData.token_address,
      token_decimals: selectedVault.staticData.token_decimals,
      fee_receiver_address: selectedVault.staticData.fee_receiver_address,
    };
  }

  return {
    useDepositData,
    useWithdrawData,
    useFundData,
    isLoading: !vaults?.vaultsData || !selectedVault,
  };
}
