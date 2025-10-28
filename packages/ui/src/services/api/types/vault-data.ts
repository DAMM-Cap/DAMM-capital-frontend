export interface ActivityDataApiResponse {
  vault_id: number;
  block: number;
  log_index: number;
  tx_hash: string;
  sender: string;
  receiver: string;
  owner: string;
  assets: number;
  shares: number;
  timestamp: string;
  chain_id: number;
  vault_name: string;
  vault_address: string;
  vault_symbol: string;
  deposit_symbol: string;
  source_table: string;
  status: string;
  return_type: string;
  transfer_type: string;
}
export interface Transaction {
  id: string;
  type: string;
  amount: string;
  status: string;
  rawTs: number;
  timestamp: string;
  txHash: string;
  txHashShort: string;
  value: string;
  vaultAddress: string;
}

export interface VaultData {
  tvl: number;
  tvlChange: number;
  apr: number;
  aprChange: number;
  valueGained: number;
  valueGainedUSD: number;
  position: number;
  positionUSD: number;
  entranceRate: number;
  exitRate: number;
  performanceFee: number;
  managementFee: number;
  sharePrice: number;
  aum: number;
}

export interface PositionData {
  totalValue: number;
  totalValueUSD: number;
  wldBalance: number;
  usdcBalance: number;
  availableToRedeem: number;
  availableToRedeemUSD: number;
  vaultShare: number;
  claimableShares: number;
  sharesInWallet: number;
}

export interface VaultDataResponse {
  vaultsData: IntegratedDataResponse[];
  vaultMetrics: VaultMetricsResponse[];
  //vaultData: VaultData;
  //positionData: PositionData;
}

export interface StaticData {
  vault_id: string;
  vault_name: string;
  vault_symbol: string;
  vault_address: string;
  vault_decimals: number;
  vault_status: string;
  token_symbol: string;
  token_address: string;
  token_decimals: number;
  fee_receiver_address: string;
}

export interface IntegratedDataResponse {
  staticData: StaticData;
  vaultData: VaultData;
  positionData: PositionData;
}

export interface VaultMetricsResponse {
  vaultId: string;
  netApy: number;
  netApy30d: number;
  sharpe: number;
  aum: number;
  nav: number;
  lastSnapshotTimestamp: string;
}
