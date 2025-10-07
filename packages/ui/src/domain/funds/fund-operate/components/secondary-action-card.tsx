import { Button, Card, DammStableIcon, Label } from "@/components";
import { getTokenLogo } from "@/components/token-icons";
import { useDeposit } from "@/services/lagoon/use-deposit";
import { useWithdraw } from "@/services/lagoon/use-withdraw";
import { ArrowRightIcon, CircleCheckIcon, ClockIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useFundOperateData } from "../hooks/use-fund-operate-data";
import { useSecondaryActionViewModel } from "../hooks/use-secondary-action-view-model";

export default function SecondaryActionCard({
  vaultId,
  handleLoading,
}: {
  vaultId: string;
  handleLoading: (isLoading: boolean) => void;
}) {
  const { useWithdrawData, useDepositData } = useFundOperateData(vaultId!);

  const {
    isClaimableRedeem,
    claimableRedeemRequest,
    pendingRedeemRequest,
    isPendingRedeemRequest,
    vault_address,
    vault_symbol,
    token_symbol,
    token_address,
    fee_receiver_address,
    exitRate,
  } = useWithdrawData();

  const {
    isClaimableDeposit,
    claimableDepositRequest,
    pendingDepositRequest,
    isPendingDepositRequest,
    vault_decimals,
  } = useDepositData();

  const { submitRedeem } = useWithdraw();
  const { submitDeposit } = useDeposit();

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    handleLoading(isLoading);
  }, [isLoading, handleLoading]);

  const handleClaim = useCallback(async () => {
    setIsLoading(true);
    try {
      const amount = String(claimableDepositRequest);
      const tx = await submitDeposit(vault_address, vault_decimals, amount);
      await tx.wait();
    } finally {
      setIsLoading(false);
    }
  }, [claimableDepositRequest, submitDeposit, vault_address, vault_decimals]);

  const handleRedeem = useCallback(async () => {
    setIsLoading(true);
    try {
      const amount = String(claimableRedeemRequest);
      const tx = await submitRedeem(
        vault_address,
        token_address,
        fee_receiver_address,
        exitRate,
        amount,
      );
      await tx.wait();
    } finally {
      setIsLoading(false);
    }
  }, [
    claimableRedeemRequest,
    submitRedeem,
    vault_address,
    token_address,
    fee_receiver_address,
    exitRate,
  ]);

  const vm = useSecondaryActionViewModel({
    // deposit
    isClaimableDeposit,
    isPendingDepositRequest,
    claimableDepositRequest,
    pendingDepositRequest,
    // redeem
    isClaimableRedeem,
    isPendingRedeemRequest,
    claimableRedeemRequest,
    pendingRedeemRequest,
    // symbols
    token_symbol,
    vault_symbol,
    // actions
    handleClaim,
    handleRedeem,
    // TODO: false to allow claiming shares manually when disabling keeper bot in production
    extraDisableOnClaimableDeposit: true,
  });

  if (!vm.visible) return null;

  const StatusIcon =
    vm.statusIcon === "check" ? CircleCheckIcon : vm.statusIcon === "clock" ? ClockIcon : null;
  const FromVisual =
    vm.from === "stable"
      ? DammStableIcon
      : () => (
          <img
            src={getTokenLogo(token_symbol)}
            alt={token_symbol}
            className="w-5 h-5 object-cover rounded-full"
          />
        );
  const ToVisual =
    vm.to === "stable"
      ? DammStableIcon
      : () => (
          <img
            src={getTokenLogo(token_symbol)}
            alt={token_symbol}
            className="w-5 h-5 object-cover rounded-full"
          />
        );

  return (
    <div className="flex flex-row justify-center gap-4 w-full mt-4">
      <Card className="w-full">
        <Label label={vm.label} className="!font-bold !text-lg !text-textLight mb-1" />
        <div className="flex flex-row justify-between gap-2">
          <div className="flex flex-row gap-2 items-center">
            <div className="-mt-2">{FromVisual && <FromVisual />}</div>
            <Label label={vm.tokenSymbolFrom} className="!text-normal !text-textLight mb-1" />
            <ArrowRightIcon size={12} className="-mt-2" />
            <div className="-mt-2">{ToVisual && <ToVisual />}</div>
            <Label label={vm.tokenSymbolTo} className="!text-normal !text-textLight mb-1" />
          </div>
          {StatusIcon && <StatusIcon size={28} />}
        </div>
        <Label label={vm.amountLabel} className="mb-4" />
        <Button variant="primary" className="w-full" onClick={vm.onClick} disabled={vm.disabled}>
          {vm.buttonLabel}
        </Button>
      </Card>
    </div>
  );
}
