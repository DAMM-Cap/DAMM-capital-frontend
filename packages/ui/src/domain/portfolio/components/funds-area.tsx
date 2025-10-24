import { Card, Label } from "@/components";
import FundCard from "./fund-card";
import { FundData } from "../utils/fund-data-utils";
import { Vault } from "@/shared/types";

export default function FundsArea({
  isLoading,
  vaultsWithPositions,
}: {
  isLoading: boolean;
  vaultsWithPositions: { vault: Vault, fundData: FundData }[];
}) {
  const hasPositions = vaultsWithPositions.length > 0;

  if (!hasPositions) {
    return (
      <Card variant="fund" className="flex flex-col gap-4">
        <Label label="You currently hold no assets in any Fund." className="domain-subtitle" />
      </Card>
    );
  }

  return (
    <div className="justify-between items-center mb-10 gap-4 max-w-full">
      {vaultsWithPositions.map((vault) => {
        return <FundCard isLoading={isLoading} fundData={vault.fundData} vault={vault.vault} key={vault.vault.id} />;
      })}
    </div>
  );
}
