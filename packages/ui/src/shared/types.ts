import { Address } from "viem";

export type Vault = {
  id: string;
  icon: string;
  name: string;
  symbol: string;
  address: Address;
  decimals: number;
  status: string;
  tokenSymbol: string;
  tokenAddress: Address;
  tokenDecimals: number;
  feeReceiverAddress: string;
  aum: number;
  sharePrice: number;
  entranceRate: number;
};