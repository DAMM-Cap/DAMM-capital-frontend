import { Button, Card, DammStableIcon, Label, Table } from "@/components";
import AcknowledgeTermsModal from "@/components/layout/acknowledge-terms-modal";
import { useSession } from "@/context/session-context";
import { useVaults } from "@/context/vault-context";
import { useModal } from "@/hooks/use-modal";
import { VaultMetricsView, VaultsDataView } from "@/services/api/types/data-presenter";
import { useNavigate } from "@tanstack/react-router";
import { LogInIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Funds() {
  const navigate = useNavigate();
  const { isSignedIn, login } = useSession();
  const [isLoadingFund, setIsLoadingFund] = useState(true);
  const { vaults } = useVaults();
  const vaultsData: VaultsDataView[] | undefined = vaults?.vaultsData;
  const vaultMetrics: VaultMetricsView[] | undefined = vaults?.vaultMetrics;
  const noVaults = !vaultsData || vaultsData.length === 0 || !vaultsData?.[0]?.staticData.vault_id;

  const {
    isOpen: openModalTerms,
    open: setOpenModalTerms,
    toggle: toggleModalTerms,
  } = useModal(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoadingFund(false);
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col">
        <Label label="Funds" className="domain-title" />
        <Label
          label="Choose from our selection of DeFi Funds."
          className="domain-subtitle pb-4 pt-1"
        />
      </div>

      {!noVaults && (
        <Table
          tableHeaders={[
            { label: "Name", className: "text-left" },
            { label: "Net APY", className: "text-left" },
            { label: "30 days Net APY", className: "text-left" },
            { label: "AUM", className: "text-left" },
            { label: "Underlying Asset", className: "text-left" },
          ]}
          isLoading={isLoadingFund}
          rows={vaultsData?.map((fund) => {
            const metrics = vaultMetrics?.find((v) => v.vaultId === fund.staticData.vault_id);
            return {
              onClick: () => {
                navigate({ to: "/fund-operate", search: { vaultId: fund.staticData.vault_id } });
              },
              rowFields: [
                {
                  leftIcon: () => <DammStableIcon size={32} />,
                  value: fund.staticData.vault_name,
                  subtitle: fund.staticData.vault_symbol,
                  className: "text-left font-bold text-lg",
                },
                {
                  value: metrics?.netApy.toString() || "0",
                  className: "text-left text-primary",
                },
                {
                  value: metrics?.netApy30d.toString() || "0",
                  className: "text-left",
                },
                {
                  value: metrics?.aum.toString() || "0",
                  className: "text-left",
                },
                {
                  leftIcon: () => (
                    <img
                      src={fund.staticData.vault_icon}
                      alt={fund.staticData.vault_name}
                      className="w-5 h-5 object-cover rounded-full"
                    />
                  ),
                  value: fund.staticData.token_symbol,
                  className: "text-left",
                },
              ],
            };
          })}
        />
      )}

      {noVaults && (
        <Card variant="fund" className="flex flex-col gap-4">
          <Label
            label="We currently have no active funds in this chain."
            className="domain-subtitle"
          />
        </Card>
      )}

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
            <Button onClick={setOpenModalTerms} className="!text-xs">
              <LogInIcon size={16} />
              Connect Wallet to Get Started
            </Button>
          </div>
        </Card>
      )}
      <AcknowledgeTermsModal
        openModalTerms={openModalTerms}
        setOpenModalTerms={toggleModalTerms}
        handleAccept={login}
      />
    </div>
  );
}
