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

import { useSession } from "@/context/session-context";
import { useGetVaultById } from "@/services/api/use-get-vault-by-id";

export default function FundOperate() {
  const { vaultId } = useSearch({ from: "/fund-operate/" });
  const { isConnecting, evmAddress: usersAccount } = useSession();
  const { vault, isLoading: isLoadingVault } = useGetVaultById(usersAccount, vaultId!);


  const isMobile = useIsMobile();

    const isLoading = isConnecting || isLoadingVault;

    return (
        <>
          <Breadcrumb vaultName={vault?.name || ""} className="-mt-6" />
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

              {isMobile && <ManagementCard isLoading={isLoading} vault={vault!} />}

              <ThesisCard />

              <OverviewCard />

              <MetricsView
                vaultId={vaultId!}
                valueKey="sharePiceValue"
                valueLabel="Price"
                valueUnit={vault?.tokenSymbol || ""}
                label="Price History"
                isLoading={isLoading}
              />

              <MetricsView
                vaultId={vaultId!}
                valueKey="totalAssetsValue"
                valueLabel="TVL"
                valueUnit={vault?.tokenSymbol || ""}
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
                  vault={vault!}
                />
              </div>
            )}
          </div>
        </>
    );
}
