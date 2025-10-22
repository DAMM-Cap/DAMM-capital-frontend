import { Button, Card, DammStableIcon, Label, Table } from "@/components";
import AcknowledgeTermsModal from "@/components/layout/acknowledge-terms-modal";
import { useSession } from "@/context/session-context";
import { useVaults } from "@/context/vault-context";
import envParsed from "@/envParsed";
import { useModal } from "@/hooks/use-modal";
import { useNavigate } from "@tanstack/react-router";
import { LogInIcon } from "lucide-react";
import FundsSkeleton from "./components/funds-skeleton";
import { useGetVaults } from "@/services/api/use-get-vaults";
import { useGetVaultMetrics } from "@/services/api/use-get-vault-metrics";

export default function Funds() {
  const {BLOCK_VAULT} = envParsed();
  const navigate = useNavigate();
  const { isSignedIn, login, isConnecting, evmAddress: usersAccount } = useSession();
  const { vaults: vaultsData, isLoading: isLoadingVaults, hasVaults } = useGetVaults(isSignedIn ? usersAccount : "0x");
  const { vaultMetricsData: vaultMetrics, isLoading: isLoadingVaultMetrics } = useGetVaultMetrics(isSignedIn ? usersAccount : "0x");

  const {
    isOpen: openModalTerms,
    open: setOpenModalTerms,
    toggle: toggleModalTerms,
  } = useModal(false);

  const isLoadingFund = isConnecting || isLoadingVaults || isLoadingVaultMetrics;

  if (isLoadingFund) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <FundsSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col">
        <Label label="Funds" className="domain-title" />
        <Label
          label="Choose from our selection of DeFi Funds."
          className="domain-subtitle pb-4 pt-1"
        />
      </div>

      {!isLoadingFund && hasVaults && (
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
            const metrics = vaultMetrics?.find((v) => v.id === fund.id);
            return {
              onClick: () => {
                if (BLOCK_VAULT === fund.address) {
                  return;
                } else {
                  navigate({ to: "/fund-operate", search: { vaultId: fund.id } });
                }
              },
              rowFields: [
                {
                  leftIcon: () => <DammStableIcon size={32} />,
                  value: fund.name,
                  subtitle: fund.symbol,
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
                  value: fund.aum.toString(),
                  className: "text-left",
                },
                {
                  leftIcon: () => (
                    <img
                      src={fund.icon}
                      alt={fund.name}
                      className="w-5 h-5 object-cover rounded-full"
                    />
                  ),
                  value: fund.tokenSymbol,
                  className: "text-left",
                },
              ],
            };
          })}
        />
      )}

      {!isLoadingFund && !hasVaults && (
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
