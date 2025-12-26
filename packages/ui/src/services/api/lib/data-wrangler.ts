import {
  DataPresenter,
  PositionDataView,
  StaticDataView,
  TransactionView,
  VaultDataView,
} from "@/services/api/types/data-presenter";
import {
  PositionData,
  StaticData,
  Transaction,
  VaultData,
  VaultDataResponse,
} from "@/services/api/types/vault-data";
import { getTokenLogo } from "@/components/token-icons";

export function DataWrangler({ data }: { data: VaultDataResponse }): DataPresenter {
  return {
    vaultsData: data.vaultsData.map((vault) => ({
      staticData: transformStaticData(vault.staticData),
      vaultData: transformVaultData(vault.vaultData, vault.staticData.token_symbol),
      positionData: transformPositionData(
        vault.positionData,
        vault.staticData.token_symbol,
        vault.staticData.vault_symbol,
      ),
    })),
    vaultMetrics: data.vaultMetrics,
    //activityData: transformActivityData(data.activityData),
  };
}

export function transformStaticData(staticData: StaticData): StaticDataView {
  const tokenSymbolBase = staticData.token_symbol.split("(")[0].trim();
  return {
    vault_id: staticData.vault_id,
    vault_name: staticData.vault_name,
    vault_symbol: staticData.vault_symbol,
    vault_address: staticData.vault_address,
    vault_decimals: staticData.vault_decimals,
    vault_status: staticData.vault_status,
    token_symbol: staticData.token_symbol,
    token_address: staticData.token_address,
    token_decimals: staticData.token_decimals,
    fee_receiver_address: staticData.fee_receiver_address,
    vault_icon: getTokenLogo(tokenSymbolBase),
  };
}

export function transformVaultData(vaultData: VaultData, tokenSymbol: string): VaultDataView {
  return {
    tvl: `$${vaultData.tvl}`,
    tvlChange: `(${vaultData.tvlChange > 0 ? "+" : ""}${vaultData.tvlChange}%)`,
    apr: `${vaultData.apr}%`,
    aprRaw: vaultData.apr,
    aprChange: `(${Number(vaultData.aprChange) > 0 ? "+" : ""}${vaultData.aprChange}%)`,
    valueGained: `${vaultData.valueGained} ${tokenSymbol}`,
    valueGainedUSD: `≈ $${vaultData.valueGainedUSD}`,
    position: `${vaultData.position} ${tokenSymbol}`,
    positionRaw: vaultData.position,
    positionUSD: `≈ $${vaultData.positionUSD}`,
    entranceRate: vaultData.entranceRate,
    exitRate: vaultData.exitRate,
    performanceRate: vaultData.performanceRate,
    managementRate: vaultData.managementRate,
    sharePrice: vaultData.sharePrice,
    aum: vaultData.aum,
  };
}

export function transformPositionData(
  positionData: PositionData,
  tokenSymbol: string,
  vaultSymbol: string,
): PositionDataView {
  return {
    totalValue: `${positionData.totalValue} ${tokenSymbol}`,
    totalValueUSD: `≈ $${positionData.totalValueUSD}`,
    totalValueRaw: positionData.totalValue,
    wldBalance: `${positionData.wldBalance} ${tokenSymbol}`,
    usdcBalance: `${positionData.usdcBalance} USDC`,
    availableToRedeem: `${positionData.availableToRedeem} ${tokenSymbol}`,
    availableToRedeemRaw: positionData.availableToRedeem,
    availableToRedeemUSD: `≈ $${positionData.availableToRedeemUSD}`,
    vaultShare: `${positionData.vaultShare}%`,
    claimableShares: `${positionData.claimableShares} ${vaultSymbol}`,
    sharesInWallet: `${positionData.sharesInWallet} ${vaultSymbol}`,
  };
}

export function transformActivityData(activityData: Transaction[]): TransactionView[] {
  return activityData.map((activity) => ({
    id: activity.id,
    type: activity.type,
    amount: activity.amount,
    status: activity.status,
    rawTs: activity.rawTs,
    timestamp: activity.timestamp,
    txHash: activity.txHash,
    txHashShort: activity.txHashShort,
    value: activity.value,
    vaultAddress: activity.vaultAddress,
  }));
}
