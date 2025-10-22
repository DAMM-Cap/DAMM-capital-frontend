import { Card, DammStableIcon, Label, TitleLabel } from "@/components";
import { useIsMobile } from "@/components/hooks/use-is-mobile";
import { useSession } from "@/context/session-context";
import { useSearch } from "@tanstack/react-router";
import clsx from "clsx";
import SecondaryActionCard from "./secondary-action-card";

import Deposit from "../deposit";
import { useFundOperateData } from "../hooks/use-fund-operate-data";
import Withdraw from "../withdraw";
import { Vault } from "@/shared/types";

export default function ManagementCard({
  className,
  isLoading,
  vault,
}: {
  className?: string;
  isLoading: boolean;
  vault: Vault;
}) {
  const { vaultId } = useSearch({ from: "/fund-operate/" });
  const { useFundData, isLoading: isLoadingFundOperateData } = useFundOperateData(vaultId!);
  const isMobile = useIsMobile();
  const { isSignedIn } = useSession();

  const {
    vault_name,
    vault_icon,
    token_symbol,
    vault_symbol,
    totalValueRaw,
    walletBalance,
    totalValueUSD,
  } = useFundData();

  const isLoadingTitle = isLoading || isLoadingFundOperateData;

  return (
    <div
      className={clsx("flex-1", className, {
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
          title={totalValueRaw.toString() + " " + vault_symbol}
          leftIcon={<DammStableIcon size={20} />}
          secondaryTitle={totalValueUSD?.toString()}
          label="My position"
          isLoading={isLoadingTitle}
        />

        <TitleLabel
          title={walletBalance.toString() + " " + token_symbol}
          leftIcon={
            <img src={vault_icon} alt={vault_name} className="w-5 h-5 object-cover rounded-full" />
          }
          label="My wallet balance"
          isLoading={isLoadingTitle}
        />

        <div className="flex flex-row gap-4">
          <Deposit vault={vault} className="w-full" disabled={!isSignedIn} />
          <Withdraw vault={vault} className="w-full" disabled={!isSignedIn} />
        </div>
        {isSignedIn && <SecondaryActionCard vaultId={vaultId!} />}
      </Card>
    </div>
  );
}
