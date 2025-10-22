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
import { useVaults } from "@/context/vault-context";
import { useSession } from "@/context/session-context";

export default function FundOperate() {
  const { vaultId } = useSearch({ from: "/fund-operate/" });
  const { useFundData, isLoading: vaultLoading } = useFundOperateData(vaultId!);
  const { isLoading: isLoadingVaults } = useVaults();
  const { isConnecting } = useSession();
  const isMobile = useIsMobile();

    const { vault_name, token_symbol } = useFundData();

    const isLoading = isConnecting || isLoadingVaults || vaultLoading;

    return (
        <>
          <Breadcrumb vaultName={vault_name} className="-mt-6" />
          <div
            className={clsx("grid gap-8 max-w-full", {
              "grid-cols-[2fr_1fr]": !isMobile,
              "grid-cols-1": isMobile,
            })}
          >
            <div
              className={clsx(
                "flex flex-col justify-start gap-4 overflow-y-auto max-h-content-area scrollbar-visible col-span-1",
              )}
            >
              <FundCard isLoading={isLoading} />

              {isMobile && <ManagementCard isLoading={isLoading} />}

              <ThesisCard />

              <OverviewCard />

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
              <div className="flex justify-end col-span-1">
                <ManagementCard
                  className="overflow-y-auto max-h-content-area scrollbar-visible"
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>
        </>
    );
}
