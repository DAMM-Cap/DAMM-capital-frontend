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
