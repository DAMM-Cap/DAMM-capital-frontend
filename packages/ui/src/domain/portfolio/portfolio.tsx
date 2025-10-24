import { Label } from "@/components";
import { useSession } from "@/context/session-context";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import FundsArea from "./components/funds-area";
import SingleValueCard from "./components/single-value-card";
import { usePortfolioData } from "./hooks/use-portfolio-data";
import { useGetVaultMetrics } from "@/services/api/use-get-vault-metrics";
import { useGetVaults } from "@/services/api/use-get-vaults";

export default function Portfolio() {
  const navigate = useNavigate();
  const { isSignedIn } = useSession();
  const { vaults = [], isLoading: isLoadingVaults } = useGetVaults();
  const { vaultMetricsData = [], isLoading: isLoadingVaultMetrics } = useGetVaultMetrics();
  const { portfolioTotals, vaultsWithPositions } = usePortfolioData(vaults, vaultMetricsData);

  const { tvl, yieldEarned, deposited } = portfolioTotals;

  useEffect(() => {
    if (!isSignedIn) {
      navigate({ to: "/funds" });
    }
  }, [isSignedIn]);

  const isLoading = isLoadingVaults || isLoadingVaultMetrics;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col">
        <Label label="Portfolio" className="domain-title" />
        <Label
          label="Track your deposits and earnings across all funds."
          className="domain-subtitle pb-4 pt-1"
        />
      </div>

      <div className="overflow-y-auto max-h-content-area scrollbar-visible">
        <div className="flex flex-wrap justify-between items-center gap-x-4">
          <SingleValueCard
            label="Total Portfolio Value"
            value={tvl.toString()}
            isLoading={isLoading}
          />
          <SingleValueCard
            label="Total Yield Earned"
            value={yieldEarned.toString()}
            isLoading={isLoading}
            className="!text-primary"
          />
          <SingleValueCard
            label="Total Deposited"
            value={deposited.toString()}
            isLoading={isLoading}
          />
        </div>

        <FundsArea
          isLoading={isLoading}
          vaultsWithPositions={vaultsWithPositions}
        />
      </div>
    </div>
  );
}
