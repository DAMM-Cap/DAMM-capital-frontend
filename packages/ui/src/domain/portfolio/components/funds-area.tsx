import { Card, Label } from "@/components";
import { PortfolioFundData } from "../hooks/use-portfolio-data";
import FundCard from "./fund-card";

interface FundsAreaProps {
  isLoading: boolean;
  vaultIds: string[];
  getFundData: (vaultId: string) => PortfolioFundData;
}

export default function FundsArea({ isLoading, vaultIds, getFundData }: FundsAreaProps) {

  // Get fund data for all vaults to check positions
  const vaultFundData =
    vaultIds?.map((vaultId) => {
      const fundData = getFundData(vaultId!);
      return { vaultId, ...fundData };
    }) || [];

  const noPosition = vaultFundData.every(({ positionSize, operationActive }) => {
    return Number(positionSize) === 0 && !operationActive;
  });

  const noVaults = !vaultIds || vaultIds.length === 0 || !vaultIds?.[0] || noPosition;

  if (noVaults) {
    return (
      <Card variant="fund" className="flex flex-col gap-4">
        <Label label="You currently hold no assets in any Fund." className="domain-subtitle" />
      </Card>
    );
  }

  return (
    <div className="justify-between items-center mb-10 gap-4 max-w-full">
      {vaultIds?.map((vaultId) => (
        <FundCard key={vaultId} isLoading={isLoading} vaultId={vaultId} fundData={getFundData(vaultId)} />
      ))}
    </div>
  );
}
