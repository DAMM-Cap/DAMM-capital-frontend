import { Vault } from "@/shared/types";
import TokenCard from "./token-card";
import { Card, Label } from "@/components";

export function TokensSection({
  vaults,
  hasVaults,
  isLoading,
}: {
  vaults: Vault[];
  hasVaults: boolean;
  isLoading: boolean;
}) {
  const loadingVaults = Array.from({ length: 5 }).map((_, index) => ({
    id: `loading-${index}`,
    name: "Loading...",
    symbol: "Loading...",
    address: "",
    decimals: 0,
  }));

  if (!isLoading && !hasVaults) {
    return (
      <Card variant="fund" className="flex flex-col gap-4">
        <Label
          label="We currently have no active funds in this chain."
          className="domain-subtitle"
        />
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between text-sm font-montserrat font-normal leading-none text-neutral">
        <div className="text-left">Assets</div>
        <div className="text-right">Amount</div>
      </div>
      {!isLoading &&
        vaults?.map((vault) => <TokenCard key={vault.id} vault={vault} isLoading={isLoading} />)}
      {isLoading &&
        loadingVaults.map((vault) => (
          <TokenCard key={vault.id} vault={vault as Vault} isLoading={isLoading} />
        ))}
    </div>
  );
}
