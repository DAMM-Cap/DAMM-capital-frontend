import { GetVaultResponse } from "@/services/api/types/vault";
import { formatToMaxDefinition } from "@/shared/utils";
import { Vault } from "@/shared/types";
import { Address } from "viem";

export function convertVaultToVaultData(vault: GetVaultResponse): Vault {
  return {
    id: vault.vault_id,
    icon: "/" + vault.token_symbol.split("(")[0].toLowerCase() + ".png",
    name: vault.vault_name,
    symbol: vault.vault_symbol,
    address: vault.vault_address as Address,
    decimals: vault.vault_decimals,
    status: vault.vault_status,
    tokenSymbol: vault.token_symbol,
    tokenAddress: vault.token_address as Address,
    tokenDecimals: vault.token_decimals,
    feeReceiverAddress: vault.fee_receiver_address,
    aum: formatToMaxDefinition((vault.latest_tvl / 10 ** vault.token_decimals) * vault.share_price),
    sharePrice: vault.share_price,
    entranceRate: vault.entrance_rate,
  } satisfies Vault;
}

export function convertVaultsToVaultsData(vaults: GetVaultResponse[]): Vault[] {
  return vaults.map((vault) => convertVaultToVaultData(vault));
}