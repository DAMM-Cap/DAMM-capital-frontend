import { useVaults } from "@/context/vault-context";
import { VaultMetricsView, VaultsDataView } from "@/services/api/types/data-presenter";
import { useOperationStateQuery } from "@/services/lagoon/use-operation-state";
import { useTokensBalance } from "@/services/shared/use-tokens-balance";
import { formatToMaxDefinition } from "@/shared/utils";
import { useEffect, useState } from "react";

export function useFundOperateData(vaultId: string) {
  const { vaults } = useVaults();
  const [selectedVault, setSelectedVault] = useState<VaultsDataView | undefined>(undefined);
  const { data: tokensBalance } = useTokensBalance();
  const walletBalance = Number(tokensBalance?.vaultBalances[vaultId]?.availableSupply || 0);
  const availableAssets = Number(tokensBalance?.vaultBalances[vaultId]?.assets || 0);
  const availableShares = Number(tokensBalance?.vaultBalances[vaultId]?.shares || 0);
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

  const { data: opState } = useOperationStateQuery([{
    vaultId: selectedVault?.staticData.vault_id,
    vaultAddress: selectedVault?.staticData.vault_address,
    tokenDecimals: selectedVault?.staticData.token_decimals,
    vaultDecimals: selectedVault?.staticData.vault_decimals}]
  );
  
  function useDepositData() {
    const thisOpState = opState?.find((o) => o.vaultId === selectedVault?.staticData.vault_id);
    if (!selectedVault || !thisOpState) {
      return {
        position: 0,
        positionUSD: 0,
        conversionValue: 0,
        vault_address: "",
        token_address: "",
        token_decimals: 0,
        token_symbol: "",
        vault_symbol: "",
        vault_decimals: 0,
        fee_receiver_address: "",
        entranceRate: 0,
        walletBalance: 0,
        isUserWhitelisted: false,
        claimableDepositRequest: 0,
        isClaimableDeposit: false,
        isPendingDepositRequest: false,
        pendingDepositRequest: 0,
        getConvertedValue: (amount: number) => useConversionValue(amount),
      };
    }

    const isUserWhitelisted = thisOpState.isWhitelisted;
    const claimableDepositRequest = thisOpState.claimableDepositRequest;
    const pendingDepositRequest = thisOpState.pendingDepositRequest;
    const vaultDecimals = selectedVault.staticData.vault_decimals;
    const tokenDecimals = selectedVault.staticData.token_decimals;
    const sharePrice = selectedVault.vaultData.sharePrice;
    const conversionValue = formatToMaxDefinition(
      1 / ((sharePrice * 10 ** vaultDecimals) / 10 ** tokenDecimals),
    );

    function useConversionValue(amount: number) {
      if (!selectedVault) {
        return 0;
      }
      const vaultDecimals = selectedVault.staticData.vault_decimals;
      const tokenDecimals = selectedVault.staticData.token_decimals;
      const sharePrice = selectedVault.vaultData.sharePrice;
      return formatToMaxDefinition(
        (amount * 10 ** tokenDecimals) / sharePrice / 10 ** vaultDecimals,
      );
    }

    return {
      position: availableShares,
      positionUSD: `≈ $${availableAssets}`,
      conversionValue,
      vault_address: selectedVault.staticData.vault_address,
      token_address: selectedVault.staticData.token_address,
      token_decimals: tokenDecimals,
      token_symbol: selectedVault.staticData.token_symbol,
      vault_symbol: selectedVault.staticData.vault_symbol,
      vault_decimals: vaultDecimals,
      fee_receiver_address: selectedVault.staticData.fee_receiver_address,
      entranceRate: selectedVault.vaultData.entranceRate,
      walletBalance: walletBalance,
      isUserWhitelisted,
      claimableDepositRequest,
      isClaimableDeposit: claimableDepositRequest > 0,
      pendingDepositRequest,
      isPendingDepositRequest: pendingDepositRequest > 0,
      getConvertedValue: (amount: number) => useConversionValue(amount),
    };
  }

  function useWithdrawData() {
    const thisOpState = opState?.find((o) => o.vaultId === selectedVault?.staticData.vault_id);
    if (!selectedVault || !thisOpState) {
      return {
        position: 0,
        positionUSD: 0,
        conversionValue: 0,
        vault_address: "",
        vault_symbol: "",
        token_address: "",
        token_decimals: 0,
        vault_decimals: 0,
        fee_receiver_address: "",
        exitRate: 0,
        availableToRedeemRaw: 0,
        vault_status: "",
        token_symbol: "",
        isClaimableRedeem: false,
        claimableRedeemRequest: 0,
        isPendingRedeemRequest: false,
        pendingRedeemRequest: 0,
        getConvertedValue: (amount: number) => useConversionValue(amount),
      };
    }
    const claimableRedeemRequest = thisOpState.claimableRedeemRequest;
    const pendingRedeemRequest = thisOpState.pendingRedeemRequest;
    const vaultDecimals = selectedVault.staticData.vault_decimals;
    const tokenDecimals = selectedVault.staticData.token_decimals;
    const sharePrice = selectedVault.vaultData.sharePrice;
    const conversionValue = formatToMaxDefinition(
      (sharePrice * 10 ** vaultDecimals) / 10 ** tokenDecimals,
    );

    function useConversionValue(amount: number) {
      if (!selectedVault) {
        return 0;
      }
      const vaultDecimals = selectedVault.staticData.vault_decimals;
      const tokenDecimals = selectedVault.staticData.token_decimals;
      const sharePrice = selectedVault.vaultData.sharePrice;
      return formatToMaxDefinition(
        (amount * 10 ** vaultDecimals * sharePrice) / 10 ** tokenDecimals,
      );
    }

    return {
      position: availableShares,
      positionUSD: `≈ $${availableAssets}`,
      conversionValue,
      vault_address: selectedVault.staticData.vault_address,
      vault_symbol: selectedVault.staticData.vault_symbol,
      token_address: selectedVault.staticData.token_address,
      fee_receiver_address: selectedVault.staticData.fee_receiver_address,
      vault_decimals: vaultDecimals,
      exitRate: selectedVault.vaultData.exitRate,
      availableToRedeemRaw: selectedVault.positionData.availableToRedeemRaw || 0,
      vault_status: selectedVault.staticData.vault_status,
      token_symbol: selectedVault.staticData.token_symbol,
      isClaimableRedeem: claimableRedeemRequest > 0,
      claimableRedeemRequest,
      isPendingRedeemRequest: pendingRedeemRequest > 0,
      pendingRedeemRequest,
      getConvertedValue: (amount: number) => useConversionValue(amount),
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
        totalValueRaw: 0,
        sharePrice: 0,
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
        sharpe: 0,
        netApy: 0,
        netApy30d: 0,
        aum: 0,
        nav: 0,
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
      totalValueRaw: availableShares,
      totalValueUSD: `≈ $${availableAssets}`,
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
      sharpe: selectedVaultMetrics?.sharpe || 0,
      netApy: selectedVaultMetrics?.netApy || 0,
      netApy30d: selectedVaultMetrics?.netApy30d || 0,
      aum: selectedVaultMetrics?.aum || 0,
      nav: selectedVaultMetrics?.nav || 0,
      //aum: selectedVault.vaultData.aum,
    };
  }

  return {
    useDepositData,
    useWithdrawData,
    useFundData,
    isLoading: !vaults?.vaultsData || !selectedVault,
  };
}
