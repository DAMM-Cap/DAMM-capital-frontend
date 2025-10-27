export type GetVaultResponse = {
  vault_id: string;
  vault_icon: string;
  vault_name: string;
  vault_symbol: string;
  vault_address: string;
  vault_decimals: number;
  vault_status: string;
  token_symbol: string;
  token_address: string;
  token_decimals: number;
  fee_receiver_address: string;
  latest_tvl: number;
  share_price: number;
  entrance_rate: number;
};