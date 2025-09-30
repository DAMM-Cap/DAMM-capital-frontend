import { Button, Card, DammStableIcon, Label, Row, Table } from "@/components";
import { useSession } from "@/context/session-context";
import { useVaults } from "@/context/vault-context";
import { VaultsDataView } from "@/services/api/types/data-presenter";
import { useNavigate } from "@tanstack/react-router";
import { LogInIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Funds() {
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

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col">
        <Label label="Funds" className="domain-title" />
        <Label
          label="Choose from our selection of DeFi Funds."
          className="domain-subtitle pb-4 pt-1"
        />
      </div>

      <Table
        tableHeaders={[
          { label: "Name", className: "text-left" },
          { label: "Net APY", className: "text-center" },
          { label: "30 days Net APY", className: "text-center" },
          { label: "AUM", className: "text-center" },
          { label: "Underlying Asset", className: "text-right" },
        ]}
      >
        {vaultsData?.map((fund) => (
          <Row
            key={fund.staticData.vault_id}
            onClick={() => {
              navigate({ to: "/fund-operate", search: { vaultId: fund.staticData.vault_id } });
            }}
            isLoading={isLoadingFund}
            rowFields={[
              {
                leftIcon: <DammStableIcon size={20} />,
                value: fund.staticData.vault_name,
                subtitle: fund.staticData.vault_symbol,
                className: "text-left font-bold text-lg",
              },
              {
                value: fund.vaultData.apr.toString(),
                className: "text-center text-primary",
              },
              {
                value: fund.vaultData.aprChange.toString(),
                className: "text-center",
              },
              {
                value: fund.vaultData.tvl.toString(),
                className: "text-center",
              },
              {
                leftIcon: (
                  <img
                    src={fund.staticData.vault_icon}
                    alt={fund.staticData.vault_name}
                    className="w-5 h-5 object-cover rounded-full"
                  />
                ),
                value: fund.staticData.token_symbol,
                className: "text-right",
              },
            ]}
          />
        ))}
      </Table>

      {/* <Table
        tableHeaders={[
          { label: "Name", className: "text-left" },
          { label: "Net APY", className: "text-right" },
          { label: "30 days Net APY", className: "text-right" },
          { label: "AUM", className: "text-right" },
          { label: "Underlying Asset", className: "text-right" },
        ]}
      >
        {vaultsData?.map((fund) => (
          <Row
            isLoading={isLoadingFund}
            rowFields={[
              {
                leftIcon: <DammStableIcon size={20} />,
                value: fund.staticData.vault_name,
                subtitle: fund.staticData.vault_symbol,
                className: "text-left font-bold",
              },
              {
                value: fund.vaultData.apr.toString(),
                className: "text-right",
              },
              {
                value: fund.vaultData.aprChange.toString(),
                className: "text-right",
              },
              {
                value: fund.vaultData.tvl.toString(),
                className: "text-right",
              },
              {
                leftIcon: (
                  <img
                    src={fund.staticData.vault_icon}
                    alt={fund.staticData.vault_name}
                    className="w-5 h-5 object-cover rounded-full"
                  />
                ),
                value: fund.staticData.token_symbol,
                className: "text-right",
              },
            ]}
          />
        ))}
      </Table> */}

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
