import { Breadcrumb } from "@/components";
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
  const {
    getFundData,
    getDepositData,
    getWithdrawData,
    refetchData,
    isLoading: vaultLoading,
  } = useFundOperateData(vaultId!);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const fundData = getFundData();
  const depositData = getDepositData();
  const withdrawData = getWithdrawData();

  if (vaultLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <Breadcrumb
        vaultName={fundData.vault_name}
        className="fixed z-30 bg-textDark -mt-16 w-full"
      />
      <div
        className={clsx("grid max-w-full", {
          "grid-cols-1": isMobile,
          "grid-cols-[minmax(0,1fr)_clamp(360px,32vw,380px)] gap-x-[clamp(0.5rem,2vw,1.25rem)]":
            !isMobile,
        })}
      >
        <div className={clsx("flex flex-col justify-start gap-4 col-span-1")}>
          <FundCard fundData={fundData} isLoading={isLoading} />

          {isMobile && (
            <ManagementCard
              fundData={fundData}
              depositData={depositData}
              withdrawData={withdrawData}
              refetchData={refetchData}
              handleLoading={setIsLoading}
              isLoading={isLoading}
            />
          )}

          <ThesisCard fundData={fundData} isLoading={isLoading} />

          <OverviewCard fundData={fundData} isLoading={isLoading} />

          <MetricsView
            vaultId={vaultId!}
            valueKey="sharePiceValue"
            valueLabel="Price"
            valueUnit={fundData.token_symbol}
            label="Price History"
            isLoading={isLoading}
          />

          <MetricsView
            vaultId={vaultId!}
            valueKey="totalAssetsValue"
            valueLabel="TVL"
            valueUnit={fundData.token_symbol}
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

          <FeesCard fundData={fundData} isLoading={isLoading} />

          <RiskDisclosureCard fundData={fundData} isLoading={isLoading} />
        </div>
        {!isMobile && (
          <div className="flex justify-end col-span-1 max-w-full max-h-full">
            <ManagementCard
              fundData={fundData}
              depositData={depositData}
              withdrawData={withdrawData}
              refetchData={refetchData}
              handleLoading={setIsLoading}
              isLoading={isLoading}
              className="fixed z-20 max-h-[calc(100vh-10.5rem)] scrollbar-visible overflow-y-auto overscroll-contain w-[360px]"
            />
          </div>
        )}
      </div>
    </div>
  );
}
