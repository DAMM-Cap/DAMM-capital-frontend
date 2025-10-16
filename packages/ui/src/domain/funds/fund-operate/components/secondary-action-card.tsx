import { Button, Card, DammStableIcon, Label } from "@/components";
import { getTokenLogo } from "@/components/token-icons";
import envParsed from "@/envParsed";
import { useDeposit } from "@/services/lagoon/use-deposit";
import { useWithdraw } from "@/services/lagoon/use-withdraw";
import { ArrowRightIcon, CircleCheckIcon, ClockIcon } from "lucide-react";
import { useFundOperateData } from "../hooks/use-fund-operate-data";
import {
  IconKind,
  useSecondaryActionViewModel,
  VisualKind,
} from "../hooks/use-secondary-action-view-model";

function StatusIcon({ type, size }: { type: IconKind; size: number }) {
  if (type === "check") return <CircleCheckIcon size={size} />;
  if (type === "clock") return <ClockIcon size={size} />;
  return null;
}

function TokenIcon({ type, tokenSymbol }: { type: VisualKind; tokenSymbol: string }) {
  if (type === "stable") return <DammStableIcon size={20} />;

  return (
    <img
      src={getTokenLogo(tokenSymbol)}
      alt={tokenSymbol}
      className="w-5 h-5 object-cover rounded-full"
    />
  );
}

export default function SecondaryActionCard({
  vaultId,
  isLoading,
  handleLoading,
}: {
  vaultId: string;
  isLoading: boolean;
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
  const { submitDeposit, cancelDepositRequest } = useDeposit();

  const handleClaim = async () => {
    handleLoading(true);
    try {
      const amount = String(claimableDepositRequest);
      const tx = await submitDeposit(vault_address, vault_decimals, amount);
      await tx.wait();
    } finally {
      handleLoading(false);
    }
  };

  const handleRedeem = async () => {
    handleLoading(true);
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
      handleLoading(false);
    }
  };

  const handleCancelDeposit = async () => {
    handleLoading(true);
    try {
      const tx = await cancelDepositRequest(vault_address);
      await tx.wait();
    } finally {
      handleLoading(false);
    }
  };

  const extraDisableOnClaimableDeposit =
    envParsed().BOT_CLAIMS_ON_BEHALF_ACTIVE !== "false" && envParsed().USE_SEPOLIA === "true";

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
    handleCancelDeposit,
    // false to allow claiming shares manually when disabling keeper bot in production
    extraDisableOnClaimableDeposit,
  });

  if (!vm.visible) return null;

  return (
    <div className="flex flex-row justify-center gap-4 w-full mt-4">
      <Card className="w-full">
        <Label label={vm.label} className="!font-bold !text-lg !text-textLight mb-1" />
        <div className="flex flex-row justify-between gap-2">
          <div className="flex flex-row gap-2 items-center">
            <div className="-mt-2">
              <TokenIcon type={vm.from} tokenSymbol={token_symbol} />
            </div>
            <Label label={vm.tokenSymbolFrom} className="!text-normal !text-textLight mb-1" />
            <ArrowRightIcon size={12} className="-mt-2" />
            <div className="-mt-2">
              <TokenIcon type={vm.to} tokenSymbol={token_symbol} />
            </div>
            <Label label={vm.tokenSymbolTo} className="!text-normal !text-textLight mb-1" />
          </div>
          <StatusIcon type={vm.statusIcon} size={28} />
        </div>
        <Label label={vm.amountLabel} isLoading={isLoading} className="mb-4" />
        <Button
          variant="primary"
          className="w-full"
          onClick={vm.onClick}
          disabled={vm.disabled}
          isLoading={isLoading}
        >
          {vm.buttonLabel}
        </Button>
      </Card>
    </div>
  );
}
