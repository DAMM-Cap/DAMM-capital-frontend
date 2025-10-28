import { Breadcrumb } from "@/components";
import { useIsMobile } from "@/components/hooks/use-is-mobile";
import { useSearch } from "@tanstack/react-router";
import clsx from "clsx";
import FeesCard from "./components/fees-card";
import FundCard from "./components/fund-card";
import ManagementCard from "./components/management-card";
import MetricsView from "./components/metrics";
import OverviewCard from "./components/overview-card";
import RiskDisclosureCard from "./components/risk-disclosure-card";
import ThesisCard from "./components/thesis-card";

import { useFundOperateData } from "./hooks/use-fund-operate-data";
import { useVaults } from "@/hooks/use-vaults";
import { useSession } from "@/context/session-context";

export default function FundOperate() {
  const { vaultId } = useSearch({ from: "/fund-operate/" });
  const {
    getFundData,
    getDepositData,
    getWithdrawData,
    isLoading: vaultLoading,
  } = useFundOperateData(vaultId!);
  const { isLoading: isLoadingVaults } = useVaults();
  const { isConnecting } = useSession();
  const isMobile = useIsMobile();

  const fundData = getFundData();
  const depositData = getDepositData();
  const withdrawData = getWithdrawData();

  const isLoading = isConnecting || isLoadingVaults || vaultLoading;

  return (
    <>
      <Breadcrumb vaultName={fundData.vault_name} className="-mt-6" />
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
              className={undefined}
              isLoading={isLoading}
            />
          )}

          <ThesisCard />

          <OverviewCard isLoading={isLoading} />

          <MetricsView
            vaultId={vaultId!}
            isLoading={isLoading}
            valueKey="sharePiceValue"
            valueLabel="Price"
            valueUnit={fundData.token_symbol}
            label="Price History"
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

          <FeesCard isLoading={isLoading} fundData={fundData} />

          <RiskDisclosureCard isLoading={isLoading} />
        </div>
        {!isMobile && (
          <ManagementCard
            fundData={fundData}
            depositData={depositData}
            withdrawData={withdrawData}
            className={undefined}
            isLoading={isLoading}
          />
        )}
      </div>
    </>
  );
}
