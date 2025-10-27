import { Breadcrumb, Label } from "@/components";
import { useIsMobile } from "@/components/hooks/use-is-mobile";
import { useSearch } from "@tanstack/react-router";
import clsx from "clsx";
import { useEffect, useState } from "react";
import FeesCard from "./components/fees-card";
import FundCard from "./components/fund-card";
import ManagementCard from "./components/management-card";
import MetricsView from "./components/metrics";
import OverviewCard from "./components/overview-card";
import RiskDisclosureCard from "./components/risk-disclosure-card";
import ThesisCard from "./components/thesis-card";

import { useFundOperateData } from "./hooks/use-fund-operate-data";

export default function FundOperate() {
  const { vaultId } = useSearch({ from: "/fund-operate/" });
  const { useFundData, isLoading: vaultLoading } = useFundOperateData(vaultId!);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  try {
    const { vault_name, token_symbol } = useFundData();

    return (
      !vaultLoading && (
        <div className="min-h-screen">
          <Breadcrumb vaultName={vault_name} className="fixed z-30 bg-textDark -mt-12 w-full" />
          <div
            className={clsx("grid max-w-full", {
              "grid-cols-1": isMobile,
              "grid-cols-[minmax(0,1fr)_clamp(360px,32vw,380px)] gap-x-[clamp(0.5rem,2vw,1.25rem)]": !isMobile,
            })}
          >
            <div
              className={clsx(
                "flex flex-col justify-start gap-4 col-span-1",
              )}
            >
              <FundCard isLoading={isLoading} />

              {isMobile && <ManagementCard handleLoading={setIsLoading} isLoading={isLoading} />}

              <ThesisCard isLoading={isLoading} />

              <OverviewCard isLoading={isLoading} />

              <MetricsView
                vaultId={vaultId!}
                valueKey="sharePiceValue"
                valueLabel="Price"
                valueUnit={token_symbol}
                label="Price History"
                isLoading={isLoading}
              />

              <MetricsView
                vaultId={vaultId!}
                valueKey="totalAssetsValue"
                valueLabel="TVL"
                valueUnit={token_symbol}
                label="Total Value"
                isLoading={isLoading}
              />

              <MetricsView
                vaultId={vaultId!}
                valueKey="apyValue"
                valueLabel="APY"
                valueUnit="%"
                label="Returns - Performance"
                isLoading={isLoading}
              />

              <FeesCard isLoading={isLoading} />

              <RiskDisclosureCard isLoading={isLoading} />
            </div>
            {!isMobile && (
              <div className="flex justify-end col-span-1 max-w-full max-h-full">
                <ManagementCard
                  handleLoading={setIsLoading}
                  isLoading={isLoading}
                  className="fixed z-20 max-h-[calc(100vh-10.5rem)] scrollbar-visible overflow-y-auto overscroll-contain w-[360px]"
                />
              </div>
            )}
          </div>
        </div>
      )
    );
  } catch (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col gap-4 w-full text-center">
          <Label label="Vault Not Found" className="domain-title mb-[0.5rem]" />
          <p className="text-textLight">The requested vault could not be found.</p>
        </div>
      </div>
    );
  }
}
