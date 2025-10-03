import { Breadcrumb, Label } from "@/components";
import { useSearch } from "@tanstack/react-router";
import { useState } from "react";
import FeesCard from "./components/fees-card";
import FundCard from "./components/fund-card";
import OverviewCard from "./components/overview-card";
import RiskDisclosureCard from "./components/risk-disclosure-card";
import ThesisCard from "./components/thesis-card";

import { useFundOperateData } from "./hooks/use-fund-operate-data";

import { useIsMobile } from "@/components/hooks/use-is-mobile";
import clsx from "clsx";
import ManagementCard from "./components/management-card";

export default function FundOperate() {
  const { vaultId } = useSearch({ from: "/fund-operate/" });
  const { useFundData, isLoading: vaultLoading } = useFundOperateData(vaultId!);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  try {
    const { vault_name } = useFundData();

    return (
      !vaultLoading && (
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
                "flex flex-col justify-start gap-4 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-visible col-span-1",
              )}
            >
              <FundCard isLoading={isLoading} />

              {isMobile && <ManagementCard handleLoading={setIsLoading} />}

              <ThesisCard />

              <OverviewCard />

              <FeesCard isLoading={isLoading} />

              <RiskDisclosureCard />
            </div>
            {!isMobile && (
              <div className="flex justify-end col-span-1">
                <ManagementCard handleLoading={setIsLoading} />
              </div>
            )}
          </div>
        </>
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
