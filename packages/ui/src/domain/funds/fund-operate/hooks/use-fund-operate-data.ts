import { useVaults } from "@/context/vault-context";
import { VaultsDataView } from "@/services/api/types/data-presenter";
import { useTokensBalance } from "@/services/shared/use-tokens-balance";
import { useEffect, useState } from "react";

export function useFundOperateData(vaultId: string) {
  const { vaults } = useVaults();
  const [selectedVault, setSelectedVault] = useState<VaultsDataView | undefined>(undefined);
  const { data: tokensBalance } = useTokensBalance();
  const walletBalance = Number(tokensBalance?.vaultBalances[vaultId]?.availableSupply || 0);
  const availableAssets = Number(tokensBalance?.vaultBalances[vaultId]?.shares || 0);

  useEffect(() => {
    if (vaultId && vaults?.vaultsData) {
      const foundVault = vaults.vaultsData.find((v) => v.staticData.vault_id === vaultId);
      setSelectedVault(foundVault);
    }
  }, [vaultId, vaults]);

  function useDepositData() {
    if (!selectedVault) {
      return {
        position: 0,
        conversionValue: 0,
        vault_address: "",
        token_address: "",
        token_decimals: 0,
        fee_receiver_address: "",
        entranceRate: 0,
        walletBalance: 0,
      };
    }
    return {
      position: selectedVault.positionData.totalValueRaw || 0,
      conversionValue: selectedVault.vaultData.sharePrice || 0,
      vault_address: selectedVault.staticData.vault_address,
      token_address: selectedVault.staticData.token_address,
      token_decimals: selectedVault.staticData.token_decimals,
      fee_receiver_address: selectedVault.staticData.fee_receiver_address,
      entranceRate: selectedVault.vaultData.entranceRate,
      walletBalance: walletBalance,
    };
  }

  function useWithdrawData() {
    if (!selectedVault) {
      return {
        position: 0,
        conversionValue: 0,
        vault_address: "",
        token_address: "",
        token_decimals: 0,
        fee_receiver_address: "",
        exitRate: 0,
        availableToRedeemRaw: 0,
        vault_status: "",
        token_symbol: "",
        availableAssets: 0,
      };
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
      availableAssets,
    };
  }

  function useFundData() {
    if (!selectedVault) {
      return {
        vault_name: "",
        vault_symbol: "",
        apr: "0",
        aprChange: "0",
        tvl: "0",
        vault_icon: "",
        token_symbol: "",
        totalValue: "0",
        vaultShare: "0",
        claimableShares: "0",
        vault_address: "",
        token_address: "",
        token_decimals: "0",
        fee_receiver_address: "",
        managementFee: 0,
        performanceFee: 0,
        entranceRate: 0,
        exitRate: 0,
        walletBalance: 0,
      };
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
      managementFee: selectedVault.vaultData.managementFee,
      performanceFee: selectedVault.vaultData.performanceFee,
      entranceRate: selectedVault.vaultData.entranceRate,
      exitRate: selectedVault.vaultData.exitRate,
      walletBalance: walletBalance,
    };
  }

  return {
    useDepositData,
    useWithdrawData,
    useFundData,
    isLoading: !vaults?.vaultsData || !selectedVault,
  };
}
