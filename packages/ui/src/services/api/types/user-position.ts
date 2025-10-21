export interface SinglePositionData {
  vault_id: string | null;
  vault_name: string | null;
  chain_id: number | null;
  vault_token_symbol: string | null;
  deposit_token_symbol: string | null;
  vault_token_address: string | null;
  deposit_token_address: string | null;
  user_address: string | null;
  user_id: string | null;
  total_assets: number | null;
  total_shares: number | null;
  share_price: number | null;
  apy: number | null;
  management_fee: number | null;
  performance_fee: number | null;
  pending_deposits: number | null;
  settled_deposits: number | null;
  completed_deposits: number | null;
  pending_redeems: number | null;
  settled_redeems: number | null;
  completed_redeems: number | null;
  user_total_shares: number | null;
  position_value: number | null;
  source_table: string | null;
}

export interface UserPositionData {
  positions: SinglePositionData[];
}
