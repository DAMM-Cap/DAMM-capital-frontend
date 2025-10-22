import { Vault } from "@/shared/types";
import { formatToMaxDefinition } from "@/shared/utils";

export function getConvertedValue(amount: number, vault: Vault) {
  const vaultDecimals = vault.decimals;
  const tokenDecimals = vault.tokenDecimals;
  const sharePrice = vault.sharePrice;


  return formatToMaxDefinition(
    (amount * 10 ** tokenDecimals) / sharePrice / 10 ** vaultDecimals,
  );
}