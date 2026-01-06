import { useVaults } from "@/context/vault-context";
import { VaultMetricsView, VaultsDataView } from "@/services/api/types/data-presenter";
import { OperationState, useOperationStateQuery } from "@/services/lagoon/use-operation-state";
import { POLL_BALANCES_FUND_OPERATE_INTERVAL, POLL_VAULTS_DATA_FUND_OPERATE_INTERVAL } from "@/shared/config/constants";
import { formatToMaxDefinition } from "@/shared/utils";
import { useEffect, useState } from "react";
import { useTokensBalance } from "./use-tokens-balance";
import { useVaultMetadata } from "@/services/api/use-vault-metadata";

export interface DepositData {
  position: number;
  positionUSD: string;
  conversionValue: number;
  vault_address: string;
  token_address: string;
  token_decimals: number;
  token_symbol: string;
  vault_symbol: string;
  vault_decimals: number;
  fee_receiver_address: string;
  entranceRate: number;
  walletBalance: number;
  isUserWhitelisted: boolean;
  claimableDepositRequest: number;
  isClaimableDeposit: boolean;
  pendingDepositRequest: number;
  isPendingDepositRequest: boolean;
  convertAssetsAmountToShares: (amount: number) => number;
  isLoading: boolean;
}

export interface WithdrawData {
  position: number;
  positionUSD: string;
  positionUSDRaw: number;
  conversionValue: number;
  vault_address: string;
  vault_symbol: string;
  token_address: string;
  token_decimals: number;
  vault_decimals: number;
  fee_receiver_address: string;
  exitRate: number;
  availableToRedeemRaw: number;
  vault_status: string;
  token_symbol: string;
  isClaimableRedeem: boolean;
  claimableRedeemRequest: number;
  isPendingRedeemRequest: boolean;
  pendingRedeemRequest: number;
  convertSharesAmountToAssets: (amount: number) => number;
  isLoading: boolean;
}

export interface FundData {
  vault_name: string;
  vault_symbol: string;
  apr: string;
  aprChange: string;
  tvl: string;
  vault_icon: string;
  token_symbol: string;
  totalValueRaw: number;
  totalValueUSD: string;
  vaultShare: string;
  claimableShares: string;
  vault_address: string;
  token_address: string;
  token_decimals: number;
  fee_receiver_address: string;
  managementRate: number;
  performanceRate: number;
  entranceRate: number;
  walletBalance: number;
  sharpe: number;
  netApy: number;
  netApy30d: number;
  exitRate: number;
  aum: number;
  metadata?: {
    thesis: string[];
    goals: string[];
    overview: string;
    riskDisclosure: {
      intro: string;
      items: Array<{
        title: string;
        description: string;
      }>;
    };
  };
}

export function useFundOperateData(vaultId: string) {
  const { vaults, refetch: refetchVaults } = useVaults(POLL_VAULTS_DATA_FUND_OPERATE_INTERVAL, true);
  const [selectedVault, setSelectedVault] = useState<VaultsDataView | undefined>(undefined);
  const [thisOpState, setThisOpState] = useState<OperationState | undefined>(undefined);
  const { data: tokensBalance, refetch: refetchTokensBalance } = useTokensBalance(POLL_BALANCES_FUND_OPERATE_INTERVAL);
  const walletBalance = Number(tokensBalance?.[vaultId]?.availableSupply || 0);
  const availableAssets = Number(tokensBalance?.[vaultId]?.assets || 0);
  const availableShares = Number(tokensBalance?.[vaultId]?.shares || 0);
  const sharePrice = Number(tokensBalance?.[vaultId]?.sharePrice || 0);
  const [selectedVaultMetrics, setSelectedVaultMetrics] = useState<VaultMetricsView | undefined>(
    undefined,
  );
  const { data: vaultMetadata } = useVaultMetadata(vaultId);

  useEffect(() => {
    if (vaultId && vaults?.vaultsData && vaults?.vaultMetrics) {
      const foundVault = vaults.vaultsData.find((v) => v.staticData.vault_id === vaultId);
      setSelectedVault(foundVault);

      const foundVaultMetrics = vaults.vaultMetrics.find((v) => v.vaultId === vaultId);
      setSelectedVaultMetrics(foundVaultMetrics);
    }
  }, [vaultId, vaults]);

  const { data: opState, refetch: refetchOpState } = useOperationStateQuery([
    {
      vaultId: selectedVault?.staticData.vault_id,
      vaultAddress: selectedVault?.staticData.vault_address,
      tokenDecimals: selectedVault?.staticData.token_decimals,
      vaultDecimals: selectedVault?.staticData.vault_decimals,
    },
  ]);

  useEffect(() => {
    if (opState && opState.length > 0) {
      setThisOpState(opState[0]);
      return;
    }
    setThisOpState(undefined);
  }, [opState]);

  function getDepositData() {
    if (!selectedVault || !thisOpState) {
      return {
        position: 0,
        positionUSD: "0",
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
        convertAssetsAmountToShares,
        isLoading: true,
      } satisfies DepositData;
    }

    const isUserWhitelisted = thisOpState.isWhitelisted;
    const claimableDepositRequest = thisOpState.claimableDepositRequest;
    const pendingDepositRequest = thisOpState.pendingDepositRequest;
    const vaultDecimals = selectedVault.staticData.vault_decimals;
    const tokenDecimals = selectedVault.staticData.token_decimals;
    const conversionValue = formatToMaxDefinition(
      1 / ((sharePrice * 10 ** vaultDecimals) / 10 ** tokenDecimals),
    );

    function convertAssetsAmountToShares(amount: number) {
      if (!selectedVault) {
        return 0;
      }
      const vaultDecimals = selectedVault.staticData.vault_decimals;
      const tokenDecimals = selectedVault.staticData.token_decimals;
      return formatToMaxDefinition(
        (amount * 10 ** tokenDecimals) / sharePrice / 10 ** vaultDecimals,
      );
    }

    return {
      position: availableShares,
      positionUSD: `≈ $${availableAssets} ${selectedVault.staticData.token_symbol}`,
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
      convertAssetsAmountToShares,
      isLoading: false,
    } satisfies DepositData;
  }

  function getWithdrawData() {
    if (!selectedVault || !thisOpState) {
      return {
        position: 0,
        positionUSD: "0",
        positionUSDRaw: 0,
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
        convertSharesAmountToAssets,
        isLoading: true,
      } satisfies WithdrawData;
    }
    const claimableRedeemRequest = thisOpState.claimableRedeemRequest;
    const pendingRedeemRequest = thisOpState.pendingRedeemRequest;
    const vaultDecimals = selectedVault.staticData.vault_decimals;
    const tokenDecimals = selectedVault.staticData.token_decimals;
    const conversionValue = formatToMaxDefinition(
      (sharePrice * 10 ** vaultDecimals) / 10 ** tokenDecimals,
    );

    function convertSharesAmountToAssets(amount: number) {
      if (!selectedVault) {
        return 0;
      }
      const vaultDecimals = selectedVault.staticData.vault_decimals;
      const tokenDecimals = selectedVault.staticData.token_decimals;
      return formatToMaxDefinition(
        (amount * 10 ** vaultDecimals * sharePrice) / 10 ** tokenDecimals,
      );
    }

    return {
      position: availableShares,
      positionUSD: `≈ $${availableAssets} ${selectedVault.staticData.token_symbol}`,
      positionUSDRaw: availableAssets,
      conversionValue,
      vault_address: selectedVault.staticData.vault_address,
      vault_symbol: selectedVault.staticData.vault_symbol,
      token_address: selectedVault.staticData.token_address,
      token_decimals: tokenDecimals,
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
      convertSharesAmountToAssets,
      isLoading: false,
    } satisfies WithdrawData;
  }

  function getFundData() {
    if (!selectedVault) {
      return {
        vault_name: "",
        vault_symbol: "",
        apr: "0",
        aprChange: "0",
        tvl: "0",
        vault_icon: "",
        token_symbol: "",
        totalValueRaw: 0,
        totalValueUSD: "0",
        vaultShare: "0",
        claimableShares: "0",
        vault_address: "",
        token_address: "",
        token_decimals: 0,
        fee_receiver_address: "",
        managementRate: 0,
        performanceRate: 0,
        entranceRate: 0,
        exitRate: 0,
        walletBalance: 0,
        sharpe: 0,
        netApy: 0,
        netApy30d: 0,
        aum: 0,
      } satisfies FundData;
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
      totalValueUSD: `≈ $${availableAssets} ${selectedVault.staticData.token_symbol}`,
      vaultShare: selectedVault.positionData.vaultShare,
      claimableShares: selectedVault.positionData.claimableShares,
      vault_address: selectedVault.staticData.vault_address,
      token_address: selectedVault.staticData.token_address,
      token_decimals: selectedVault.staticData.token_decimals,
      fee_receiver_address: selectedVault.staticData.fee_receiver_address,
      managementRate: selectedVault.vaultData.managementRate,
      performanceRate: selectedVault.vaultData.performanceRate,
      entranceRate: selectedVault.vaultData.entranceRate,
      exitRate: selectedVault.vaultData.exitRate,
      walletBalance: walletBalance,
      sharpe: selectedVaultMetrics?.sharpe || 0,
      netApy: selectedVaultMetrics?.netApy || 0,
      netApy30d: selectedVaultMetrics?.netApy30d || 0,
      aum: selectedVaultMetrics?.aum || 0,
      metadata: vaultMetadata?.metadata || undefined,
      //aum: selectedVault.vaultData.aum,
    } satisfies FundData;
  }

  async function refetchData() {
    await refetchTokensBalance();
    await refetchVaults();
    await refetchOpState();
  }

  return {
    getDepositData,
    getWithdrawData,
    getFundData,
    refetchData,
    isLoading: !vaults?.vaultsData || !selectedVault,
  };
}
