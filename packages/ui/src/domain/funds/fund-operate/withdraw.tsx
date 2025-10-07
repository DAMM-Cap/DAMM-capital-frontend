import { Button, DammStableIcon } from "@/components";
import { useModal } from "@/hooks/use-modal";
import { useWithdraw } from "@/services/lagoon/use-withdraw";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { WithdrawModal } from "./components";
import { useFundOperateData } from "./hooks/use-fund-operate-data";

interface WithdrawProps {
  vaultId: string;
  handleLoading: (isLoading: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export default function Withdraw({ vaultId, handleLoading, className, disabled }: WithdrawProps) {
  const { useWithdrawData, isLoading: vaultLoading } = useFundOperateData(vaultId);
  const [amount, setAmount] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false);
  const [invalidAmount, setInvalidAmount] = useState(false);

  const { position, conversionValue, vault_address, availableAssets: max } = useWithdrawData();

  const {
    isOpen: openModalWithdraw,
    open: setOpenModalWithdraw,
    close: setCloseModalWithdraw,
  } = useModal(false, { onClose: () => setIsLoading(false) });

  const { submitRequestWithdraw } = useWithdraw();

  useEffect(() => {
    handleLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
      setInvalidAmount(true);
      setIsInsufficientBalance(false);
    } else {
      setInvalidAmount(false);
      const isInsufficientBalance = numericAmount > max;
      setIsInsufficientBalance(isInsufficientBalance);
    }
  }, [amount]);

  const handleWithdraw = async () => {
    setIsLoading(true);

    // Execute transaction
    const tx = await submitRequestWithdraw(vault_address, amount);

    // Wait for confirmation
    await tx.wait();

    setCloseModalWithdraw();
  };

  // Don't render if vault is not found or still loading
  if (vaultLoading) {
    return null;
  }

  return (
    <div className={className}>
      <Button
        onClick={() => {
          setOpenModalWithdraw();
        }}
        variant="secondary"
        className={clsx("w-full", className)}
        disabled={disabled || max === 0}
      >
        Withdraw
      </Button>

      <WithdrawModal
        open={openModalWithdraw}
        onClose={() => setCloseModalWithdraw()}
        amount={amount}
        onAmountChange={(e) => setAmount(e.target.value)}
        onMaxClick={() => setAmount(max.toString())}
        max={max}
        position={position}
        positionConverted={position * conversionValue}
        onWithdraw={() => handleWithdraw()}
        isLoading={isLoading}
        isInsufficientShares={isInsufficientBalance}
        invalidAmount={invalidAmount}
        tokenSymbol="DUSDC"
        tokenIcon={<DammStableIcon size={20} />}
        conversionValue={conversionValue}
      />
    </div>
  );
}
