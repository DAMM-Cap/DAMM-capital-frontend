import { useOperationStateQuery } from "@/services/lagoon/use-operation-state";
import { useTokensBalance } from "@/services/shared/use-tokens-balance";
import { Vault } from "@/shared/types";
import { formatToMaxDefinition } from "@/shared/utils";
import { useMemo } from "react";

export interface VaultCalculationData {
  positionValue: number;
  totalAssets: number;
  yieldEarned: number;
}

export interface VaultCalculations {
  vaultsData: Record<string, VaultCalculationData>;
  totalPositionValue: number;
  totalTotalAssets: number;
  totalYieldEarned: number;
}

export function useVaultCalculations(vaultsData: Vault[]) {
  // Convert VaultsDataView to Vault format for useTokensBalance
  const vaultsForBalance = vaultsData?.map(vault => ({
    id: vault.id,
    icon: vault.icon,
    name: vault.name,
    symbol: vault.symbol,
    address: vault.address,
    decimals: vault.decimals,
    status: vault.status,
    tokenSymbol: vault.tokenSymbol,
    tokenAddress: vault.tokenAddress,
    tokenDecimals: vault.tokenDecimals,
    feeReceiverAddress: vault.feeReceiverAddress,
    aum: vault.aum,
    sharePrice: vault.sharePrice,
    entranceRate: vault.entranceRate,
  })) ?? [];
  
  const { data: tokensBalance } = useTokensBalance(vaultsForBalance);
  
  const { data: opState } = useOperationStateQuery(
    vaultsData?.map(vault => ({
      vaultId: vault.id,
      vaultAddress: vault.address,
      tokenDecimals: vault.tokenDecimals,
      vaultDecimals: vault.decimals,
    })) ?? []
  );

  const calculations = useMemo((): VaultCalculations => {
    if (!vaultsData || !tokensBalance || !opState) {
      return {
        vaultsData: {},
        totalPositionValue: 0,
        totalTotalAssets: 0,
        totalYieldEarned: 0,
      };
    }

    let totalPositionValue = 0;
    let totalTotalAssets = 0;
    let totalYieldEarned = 0;
    const vaultsDataMap: Record<string, VaultCalculationData> = {};

    vaultsData.forEach((vaultUserPositionData) => {
      const vaultId = vaultUserPositionData.id;
      
      // Position Value: Real time converted shares from blockchain
      const availableAssets = Number(
        tokensBalance.vaultBalances[vaultId]?.assets || 0
      );
      const positionValue = availableAssets;
      totalPositionValue += positionValue;

      // Total Assets: Original deposits tracking + settled operations
      const thisOpState = opState.find((o) => o.vaultId === vaultId);
      const settledDeposits = thisOpState?.claimableDepositRequest || 0;
      const settledRedeems = thisOpState?.claimableRedeemRequest || 0;
      const totalAssets =
        Number(vaultUserPositionData.positionRaw) + 
        Number(settledDeposits) - Number(settledRedeems);
      totalTotalAssets += totalAssets;

      // Yield Earned: Difference between position value and total assets
      const yieldEarned = positionValue - totalAssets;
      totalYieldEarned += yieldEarned;

      vaultsDataMap[vaultId] = {
        positionValue: formatToMaxDefinition(positionValue),
        totalAssets: formatToMaxDefinition(totalAssets),
        yieldEarned: formatToMaxDefinition(yieldEarned),
      };
    });

    return {
      vaultsData: vaultsDataMap,
      totalPositionValue: formatToMaxDefinition(totalPositionValue),
      totalTotalAssets: formatToMaxDefinition(totalTotalAssets),
      totalYieldEarned: formatToMaxDefinition(totalYieldEarned),
    };
  }, [vaultsData, tokensBalance, opState]);

  return calculations;
}
