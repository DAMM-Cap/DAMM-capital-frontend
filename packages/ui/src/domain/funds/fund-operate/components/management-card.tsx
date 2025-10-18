import { Card, DammStableIcon, Label, TitleLabel } from "@/components";
import { useIsMobile } from "@/components/hooks/use-is-mobile";
import { useSession } from "@/context/session-context";
import { useSearch } from "@tanstack/react-router";
import clsx from "clsx";
import SecondaryActionCard from "./secondary-action-card";

import Deposit from "../deposit";
import { useFundOperateData } from "../hooks/use-fund-operate-data";
import Withdraw from "../withdraw";

export default function ManagementCard({
  isLoading,
  handleLoading,
  className,
}: {
  isLoading: boolean;
  handleLoading: (isLoading: boolean) => void;
  className?: string;
}) {
  const { vaultId } = useSearch({ from: "/fund-operate/" });
  const { useFundData, isLoading: vaultLoading } = useFundOperateData(vaultId!);
  const isMobile = useIsMobile();
  const { isSignedIn } = useSession();

  try {
    const {
      vault_name,
      vault_icon,
      token_symbol,
      vault_symbol,
      totalValueRaw,
      walletBalance,
      totalValueUSD,
    } = useFundData();

    return (
      !vaultLoading && (
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
                <img
                  src={vault_icon}
                  alt={vault_name}
                  className="w-5 h-5 object-cover rounded-full"
                />
              }
              label="My wallet balance"
              isLoading={isLoading}
            />

            <div className="flex flex-row gap-4">
              <Deposit
                vaultId={vaultId!}
                handleLoading={handleLoading}
                className="w-full"
                disabled={!isSignedIn}
                isLoading={isLoading}
              />
              <Withdraw
                vaultId={vaultId!}
                handleLoading={handleLoading}
                className="w-full"
                disabled={!isSignedIn}
                isLoading={isLoading}
              />
            </div>
            {isSignedIn && (
              <SecondaryActionCard
                vaultId={vaultId!}
                handleLoading={handleLoading}
                isLoading={isLoading}
              />
            )}
          </Card>
        </div>
      )
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return <div>Error: {message}</div>;
  }
}
