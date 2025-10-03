import { Card, Label, TitleLabel } from "@/components";
import { useIsMobile } from "@/components/hooks/use-is-mobile";
import { useSearch } from "@tanstack/react-router";
import clsx from "clsx";
import Deposit from "../deposit";
import { useFundOperateData } from "../hooks/use-fund-operate-data";
import Withdraw from "../withdraw";

export default function ManagementCard({
  handleLoading,
}: {
  handleLoading: (isLoading: boolean) => void;
}) {
  const { vaultId } = useSearch({ from: "/fund-operate/" });
  const { useFundData, isLoading: vaultLoading } = useFundOperateData(vaultId!);
  const isMobile = useIsMobile();

  try {
    const { vault_name, vault_icon, token_symbol, totalValue, vaultShare, walletBalance } =
      useFundData();

    return (
      !vaultLoading && (
        <div
          className={clsx("flex-1", {
            "w-full": isMobile,
            "min-w-[300px] max-w-[360px]": !isMobile,
          })}
        >
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
              <Deposit vaultId={vaultId!} handleLoading={handleLoading} className="w-full" />
              <Withdraw vaultId={vaultId!} handleLoading={handleLoading} className="w-full" />
            </div>
          </Card>
        </div>
      )
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return <div>Error: {message}</div>;
  }
}
