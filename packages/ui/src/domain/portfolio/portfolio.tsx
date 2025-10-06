import { Card, Label } from "@/components";
import { useSession } from "@/context/session-context";
import { useVaults } from "@/context/vault-context";
import { VaultsDataView } from "@/services/api/types/data-presenter";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import FundCard from "./components/fund-card";

export default function Portfolio() {
  const navigate = useNavigate();
  const { isSignedIn } = useSession();
  const [isLoadingFund, setIsLoadingFund] = useState(false);
  const { vaults, isLoading } = useVaults();
  const vaultsData: VaultsDataView[] | undefined = vaults?.vaultsData;

  useEffect(() => {
    setIsLoadingFund(true);
    setTimeout(() => {
      setIsLoadingFund(false);
    }, 1000);
  }, [isLoading]);

  useEffect(() => {
    if (!isSignedIn) {
      navigate({ to: "/funds" });
    }
  }, [isSignedIn]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col">
        <Label label="Portfolio" className="domain-title" />
        <Label
          label="Track your deposits and earnings across all funds."
          className="domain-subtitle pb-4 pt-1"
        />
      </div>

      <div className="flex flex-wrap justify-between items-center gap-x-4">
        <Card variant="fund" className="flex-1 max-w-full min-w-[320px] !my-2">
          <Label label="Total Portfolio Value" className="domain-subtitle mb-0 !justify-center" />
          <Label label="0" className="domain-title !justify-center" />
        </Card>

        <Card variant="fund" className="flex-1 max-w-full min-w-[320px] !my-2">
          <Label label="Total Yield Earned" className="domain-subtitle mb-0 !justify-center" />
          <Label label="0" className="domain-title !justify-center !text-primary" />
        </Card>

        <Card variant="fund" className="flex-1 max-w-full min-w-[320px] !my-2">
          <Label label="Total Deposited" className="domain-subtitle mb-0 !justify-center" />
          <Label label="0" className="domain-title !justify-center" />
        </Card>
      </div>

      <div className="justify-between items-center mb-10 gap-4 max-w-full">
        {vaultsData?.map((fund) => (
          <FundCard
            isLoading={isLoading || isLoadingFund}
            handleIsLoading={setIsLoadingFund}
            vaultId={fund.staticData.vault_id}
            key={fund.staticData.vault_id}
          />
        ))}
      </div>
    </div>
  );
}
