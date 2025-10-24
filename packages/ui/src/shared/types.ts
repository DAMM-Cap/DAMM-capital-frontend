export interface Vault {
  id: string;
  icon: string;
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  status: string;
  tokenSymbol: string;
  tokenAddress: string;
  tokenDecimals: number;
  feeReceiverAddress: string;
  aum: number;
  sharePrice: number;
  entranceRate: number;
};

export interface VaultMetrics {
  vaultId: string;
  netApy: number;
  netApy30d: number;
  sharpe: number;
}