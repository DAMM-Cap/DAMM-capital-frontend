import LoadingField from "@/components/core/loading-field";
import Row from "@/components/custom/row";
import { useVaultBalance } from "@/services/shared/use-tokens-balance";
import { Vault } from "@/shared/types";
import { Address } from "viem";

export default function TokenCard({ vault, isLoading }: { vault: Vault; isLoading: boolean }) {
  const { vaultBalance, isLoading: isLoadingVaultBalance } = useVaultBalance(
    vault.id,
    vault.tokenAddress as Address,
    vault.address as Address,
    vault.decimals,
    vault.tokenDecimals,
  );

  const isLoadingAllFields = isLoading || isLoadingVaultBalance;

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <Row
          gridColsClassName="grid-cols-4"
          rowFields={[
            {
              leftIcon: () =>
                isLoadingAllFields ? (
                  <LoadingField variant="rounded" className="h-8 w-8" />
                ) : (
                  <img
                    src={vault.icon}
                    alt={vault.name}
                    className="w-5 h-5 object-cover rounded-full"
                  />
                ),
              isLoading: isLoadingAllFields,
              value: vault.symbol,
              className: "text-left font-bold text-lg",
            },
            {
              value: vaultBalance?.availableSupply || "0",
              isLoading: isLoadingAllFields,
              className: "text-right",
            },
          ]}
        />
      </div>
    </>
  );
}
