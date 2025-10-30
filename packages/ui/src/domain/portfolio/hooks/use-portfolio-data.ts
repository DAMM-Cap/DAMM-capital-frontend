import { useVaults } from "@/context/vault-context";
import { useOperationStateQuery } from "@/services/lagoon/use-operation-state";
import { POLL_BALANCES_PORTFOLIO_INTERVAL, POLL_VAULTS_DATA_PORTFOLIO_INTERVAL } from "@/shared/config/constants";
import { formatToMaxDefinition } from "@/shared/utils";
import { useEffect, useMemo, useState } from "react";
import { useTokensBalance } from "./use-tokens-balance";

export enum OperationStatus {
  CONFIRMED = "Confirmed",
  DEPOSIT_PENDING = "Deposit Pending",
  WITHDRAW_PENDING = "Withdraw Pending",
  SHARES_CLAIMABLE = "Shares Claimable",
  ASSETS_CLAIMABLE = "Assets Claimable",
}
export interface PortfolioFundData {
  vault_name: string,
  apr: number,
  vault_icon: string,
  token_symbol: string,
  positionSize: number,
  yieldEarned: number,
  totalAssets: number,
  operation: string,
  operationVariant: string,
  operationActive: boolean,
  lastUpdate: string | undefined,
  vault_address: string,
}

export interface PortfolioSingleValuesData {
  tvl: string,
  yieldEarned: string,
  deposited: string,
}

export function usePortfolioData() {
  const { vaults, isLoading } = useVaults(POLL_VAULTS_DATA_PORTFOLIO_INTERVAL, true);
  const { data: tokensBalance } = useTokensBalance(POLL_BALANCES_PORTFOLIO_INTERVAL);
  const [vaultsData, setVaultsData] = useState<
    Record<string, Record<"positionValue" | "totalAssets" | "yieldEarned", number>>
  >({});

  const [totalPositionValue, setTotalPositionValue] = useState<number>(0);
  const [totalTotalAssets, setTotalTotalAssets] = useState<number>(0);
  const [totalYieldEarned, setTotalYieldEarned] = useState<number>(0);

  const operationStateParams = useMemo(() => {
    return vaults?.vaultsData.map(vault => ({
      vaultId: vault.staticData.vault_id,
      vaultAddress: vault.staticData.vault_address,
      tokenDecimals: vault.staticData.token_decimals,
      vaultDecimals: vault.staticData.vault_decimals,
    })) ?? [];
  }, [vaults?.vaultsData]);

  const { data: opState } = useOperationStateQuery(operationStateParams);
  
  useEffect(() => {
    if (isLoading || opState?.length === 0) return;

    let totalPositionValue = 0;
    let totalTotalAssets = 0;
    let totalYieldEarned = 0;
    const newVaultsData: Record<string, Record<"positionValue" | "totalAssets" | "yieldEarned", number>> = {};
    
    vaults?.vaultsData.forEach((vaultUserPositionData) => {
      const selectedVault = vaults?.vaultsData.find(
        (v) => v.staticData.vault_id === vaultUserPositionData.staticData.vault_id,
      );
      if (!selectedVault) return;

      const priceUSD = tokensBalance?.[vaultUserPositionData.staticData.vault_id]?.priceUSD ?? 0;

      // Position Value retrieves real time converted shares from the blockchain
      const availableAssets = Number(
        tokensBalance?.[vaultUserPositionData.staticData.vault_id]?.assets || 0,
      );
      const positionValue = availableAssets;
      totalPositionValue += positionValue * priceUSD;
      // ------------------------------------------------------------

      // Total Assets retrieves the remaining total assets of the user in the vault
      // This is by tracking the original deposits in the original denomination
      // Deposit values are fetched from the db by the indexer action, so this is not real time
      const thisOpState = opState?.find((o) => o.vaultId === vaultUserPositionData.staticData.vault_id);
      const settledDeposits = thisOpState?.claimableDepositRequest || 0;
      const settledRedeems = thisOpState?.claimableRedeemRequest || 0;
      const totalAssets =
        Number(vaultUserPositionData.vaultData.positionRaw) + 
        Number(settledDeposits) - Number(settledRedeems);
      totalTotalAssets += totalAssets * priceUSD;
      // ------------------------------------------------------------

      // Absolute yield earned is the difference between the position value and the total assets
      const yieldEarned = positionValue - totalAssets;
      totalYieldEarned += yieldEarned;
      // ------------------------------------------------------------

      newVaultsData[vaultUserPositionData.staticData.vault_id as string] = {
        positionValue: formatToMaxDefinition(positionValue),
        totalAssets: formatToMaxDefinition(totalAssets),
        yieldEarned: formatToMaxDefinition(yieldEarned),
      };
    });
    
    setVaultsData(newVaultsData);
    setTotalPositionValue(formatToMaxDefinition(totalPositionValue));
    setTotalTotalAssets(formatToMaxDefinition(totalTotalAssets));
    setTotalYieldEarned(formatToMaxDefinition(totalYieldEarned));
  }, [vaults, tokensBalance, isLoading, opState]);

  function getFundData(vaultId: string) {
    const selectedVault = vaults!.vaultsData.find((v) => v.staticData.vault_id === vaultId);
    const selectedVaultMetrics = vaults!.vaultMetrics.find((v) => v.vaultId === vaultId);
    
    const thisOpState = opState.find((o) => o.vaultId === selectedVault?.staticData.vault_id);
    if (!selectedVault || !thisOpState) {
      return {
        vault_name: "",
        apr: 0,
        vault_icon: "",
        token_symbol: "",
        positionSize: 0,
        yieldEarned: 0,
        totalAssets: 0,
        operation: "",
        operationVariant: "outline-secondary",
        operationActive: false,
        lastUpdate: "",
        vault_address: "",
      } satisfies PortfolioFundData;
    }

    
    let operation = OperationStatus.CONFIRMED;
    let operationVariant = "outline-secondary";
    if (thisOpState.pendingDepositRequest > 0) {
      operation = OperationStatus.DEPOSIT_PENDING;
      operationVariant = "outline-secondary";
    }
    if (thisOpState.pendingRedeemRequest > 0) {
      operation = OperationStatus.WITHDRAW_PENDING;
      operationVariant = "outline-secondary";
    }
    if (thisOpState.claimableDepositRequest > 0) {
      operation = OperationStatus.SHARES_CLAIMABLE;
      operationVariant = "outline";
    }
    if (thisOpState.claimableRedeemRequest > 0) {
      operation = OperationStatus.ASSETS_CLAIMABLE;
      operationVariant = "outline";
    }

    return {
      vault_name: selectedVault.staticData.vault_name,
      apr: selectedVaultMetrics?.netApy ?? 0,
      positionSize: vaultsData[selectedVault.staticData.vault_id]?.positionValue ?? 0,
      yieldEarned: vaultsData[selectedVault.staticData.vault_id]?.yieldEarned ?? 0,
      totalAssets: vaultsData[selectedVault.staticData.vault_id]?.totalAssets ?? 0,
      vault_icon: selectedVault.staticData.vault_icon,
      vault_address: selectedVault.staticData.vault_address,
      token_symbol: selectedVault.staticData.token_symbol,
      lastUpdate: selectedVaultMetrics?.lastSnapshotTimestamp,
      operation: operation,
      operationVariant: operationVariant,
      operationActive: operation !== OperationStatus.CONFIRMED,
    } satisfies PortfolioFundData;
  }

  function getPortfolioSingleValuesData() {
    return {
      tvl: totalPositionValue,
      yieldEarned: totalYieldEarned,
      deposited: totalTotalAssets,
    };
  }

  return {
    getFundData,
    getPortfolioSingleValuesData,
    vaultIds: vaults?.vaultsData?.map((fund) => fund.staticData.vault_id),
    isLoading: isLoading,
  };
}
