import { Card, DammStableIcon, Label, TitleLabel } from "@/components";
import { useIsMobile } from "@/components/hooks/use-is-mobile";
import { useSession } from "@/context/session-context";
import clsx from "clsx";
import SecondaryActionCard from "./secondary-action-card";

import envParsed from "@/envParsed";
import Deposit from "../deposit";
import Withdraw from "../withdraw";
import { DepositData, FundData, WithdrawData } from "../hooks/use-fund-operate-data";

export default function ManagementCard({
  className,
  isLoading,
  fundData,
  depositData,
  withdrawData,
}: {
  className?: string;
  isLoading: boolean;
  fundData: FundData;
  depositData: DepositData;
  withdrawData: WithdrawData;
}) {
  const { BLOCK_VAULT } = envParsed();
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
    vault_address,
  } = fundData;

  const isBlocked = BLOCK_VAULT === vault_address;

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
          isLoading={isLoading}
        />

        <TitleLabel
          title={walletBalance.toString() + " " + token_symbol}
          leftIcon={
            <img src={vault_icon} alt={vault_name} className="w-5 h-5 object-cover rounded-full" />
          }
          label="My wallet balance"
          isLoading={isLoading}
        />

        <div className="flex flex-row gap-4">
          <Deposit
            depositData={depositData}
            className="w-full"
            disabled={!isSignedIn || isBlocked}
          />
          <Withdraw
            withdrawData={withdrawData}
            depositData={depositData}
            className="w-full"
            disabled={!isSignedIn || isBlocked}
          />
        </div>
        {isSignedIn && !isBlocked && <SecondaryActionCard withdrawData={withdrawData} depositData={depositData} isLoading={isLoading} />}
      </Card>
    </div>
  );
}
