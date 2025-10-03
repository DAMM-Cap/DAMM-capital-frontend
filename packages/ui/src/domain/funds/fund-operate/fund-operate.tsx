import { Breadcrumb, Card, Label, TitleLabel } from "@/components";
import { useSearch } from "@tanstack/react-router";
import { useState } from "react";
import FeesCard from "./components/fees-card";
import FundCard from "./components/fund-card";
import OverviewCard from "./components/overview-card";
import RiskDisclosureCard from "./components/risk-disclosure-card";
import ThesisCard from "./components/thesis-card";
import Deposit from "./deposit";
import { useFundOperateData } from "./hooks/use-fund-operate-data";
import Withdraw from "./withdraw";

export default function FundOperate() {
  const { vaultId } = useSearch({ from: "/fund-operate/" });
  const { useFundData, isLoading: vaultLoading } = useFundOperateData(vaultId!);
  const [isLoading, setIsLoading] = useState(false);

  try {
    const { vault_name, vault_icon, token_symbol, totalValue, vaultShare, walletBalance } =
      useFundData();

    return (
      !vaultLoading && (
        <>
          <Breadcrumb vaultName={vault_name} className="-mt-8" />
          <div className="flex flex-wrap flex-1 justify-center max-w-full gap-4">
            <FundCard handleLoading={setIsLoading} />

            <div className="min-w-[300px] max-w-[360px] flex-1">
              <Card variant="fund">
                <Label label="Manage position" className="domain-title mb-1" />
                <Label
                  label="Deposit or withdraw from the fund"
                  className="!text-sm text-neutral font-montserrat font-normal leading-none mb-4"
                />
                <TitleLabel
                  title={totalValue}
                  leftIcon={
                    <img
                      src={vault_icon}
                      alt={vault_name}
                      className="w-5 h-5 object-cover rounded-full"
                    />
                  }
                  secondaryTitle={vaultShare}
                  label="My position"
                />

                <TitleLabel
                  title={walletBalance.toString() + " " + token_symbol}
                  leftIcon={
                    <img
                      src={vault_icon}
                      alt={vault_name}
                      className="w-5 h-5 object-cover rounded-full"
                    />
                  }
                  label="My wallet balance"
                  /* className="!-mt-2" */
                />

                <div className="flex flex-row gap-4">
                  <Deposit vaultId={vaultId!} handleLoading={setIsLoading} className="w-full" />
                  <Withdraw vaultId={vaultId!} handleLoading={setIsLoading} className="w-full" />
                </div>
              </Card>
            </div>

            <ThesisCard />

            <OverviewCard />

            <FeesCard handleLoading={setIsLoading} />

            <RiskDisclosureCard />
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
