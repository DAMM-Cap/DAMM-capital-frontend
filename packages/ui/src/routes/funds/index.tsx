import { Button, Card, DammStableIcon, Label, TableFunds } from "@/components";
import { useVaults } from "@/context/vault-context";
import { VaultsDataView } from "@/lib/data/types/data-presenter";
import { useIsSignedIn } from "@coinbase/cdp-hooks";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogInIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/funds/")({
  component: Funds,
});

function Funds() {
  const navigate = useNavigate();
  const { isSignedIn } = useIsSignedIn();
  const [isLoadingFund, setIsLoadingFund] = useState(false);
  const { vaults, isLoading } = useVaults();
  const vaultsData: VaultsDataView[] | undefined = useMemo(
    () => vaults?.vaultsData,
    [vaults?.vaultsData],
  );

  useEffect(() => {
    setIsLoadingFund(true);
    setTimeout(() => {
      setIsLoadingFund(false);
    }, 1000);
  }, [isLoading]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col">
        <Label label="Funds" className="domain-title" />
        <Label
          label="Choose from our selection of DeFi Funds."
          className="domain-subtitle pb-4 pt-1"
        />
      </div>

      <TableFunds
        funds={
          vaultsData?.map((fund) => ({
            leftIcon: <DammStableIcon size={20} />,
            title: fund.staticData.vault_name,
            subtitle: fund.staticData.vault_symbol,
            secondColumnText: fund.vaultData.apr.toString(),
            thirdColumnText: fund.vaultData.aprChange.toString(),
            fourthColumnText: fund.vaultData.tvl.toString(),
            tokenIcon: (
              <img
                src={fund.staticData.vault_icon}
                alt={fund.staticData.vault_name}
                className="w-5 h-5 object-cover rounded-full"
              />
            ),
            tokenName: fund.staticData.token_symbol,
            onClick: () => {
              navigate({ to: "/fund-operate", search: { vaultId: fund.staticData.vault_id } });
            },
            isLoading: isLoadingFund,
            //isLoading: isLoading,
          })) || []
        }
      />

      {!isSignedIn && (
        <Card
          variant="fund"
          className="flex flex-col gap-0 items-center text-center !p-6 lg:!p-8 !mt-2 lg:!mt-16"
        >
          <div className="w-full flex justify-center">
            <Label label="Ready to start Earning?" className="mb-4 domain-secondary-title" />
          </div>
          <div className="w-full flex justify-center">
            <Label label="Connect your wallet to deposit into any of our funds." className="pb-4" />
          </div>
          <div className="w-full flex justify-center">
            <Button onClick={() => {}} className="!text-xs">
              <LogInIcon size={16} />
              Connect Wallet to Get Started
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
