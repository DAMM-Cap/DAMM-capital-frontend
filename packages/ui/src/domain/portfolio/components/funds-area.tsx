import { Card, Label } from "@/components";
import { usePortfolioData } from "../hooks/use-portfolio-data";
import FundCard from "./fund-card";

export default function FundsArea({
  isLoading,
  handleIsLoading,
}: {
  isLoading: boolean;
  handleIsLoading: (isLoading: boolean) => void;
}) {
  const { vaultIds } = usePortfolioData();

  // TODO: This is a temporary solution to check if the user has no position in any fund.
  const noPosition = () => {
    if (!vaultIds) return true;
    return vaultIds.every((vaultId) => {
      const { useFundData } = usePortfolioData(vaultId)!;
      const { positionSize, operationActive } = useFundData();
      return Number(positionSize) === 0 && !operationActive;
    });
  };

  const noVaults = !vaultIds || vaultIds.length === 0 || !vaultIds?.[0] || noPosition();

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
        <FundCard
          isLoading={isLoading}
          handleIsLoading={handleIsLoading}
          vaultId={vaultId}
          key={vaultId}
        />
      ))}
    </div>
  );
}
