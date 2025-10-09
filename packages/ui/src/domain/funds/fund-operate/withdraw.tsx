import { Button } from "@/components";
import { getTokenLogo } from "@/components/token-icons";
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
  isLoading: boolean;
}

export default function Withdraw({
  vaultId,
  handleLoading,
  className,
  disabled,
  isLoading,
}: WithdrawProps) {
  const { useWithdrawData, isLoading: vaultLoading } = useFundOperateData(vaultId);
  const [amount, setAmount] = useState("");
  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false);
  const [invalidAmount, setInvalidAmount] = useState(false);

  const {
    position,
    conversionValue,
    vault_address,
    availableAssets: max,
    token_symbol,
    vault_symbol,
  } = useWithdrawData();

  const {
    isOpen: openModalWithdraw,
    open: setOpenModalWithdraw,
    close: setCloseModalWithdraw,
  } = useModal(false, { onClose: () => handleLoading(false) });

  const { submitRequestWithdraw } = useWithdraw();

  const validateForm = () => {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || amount.length === 0) {
      setInvalidAmount(true);
      return false;
    }
    return true;
  };

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
    if (!validateForm()) return;
    handleLoading(true);

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

  const tokenIcon = (
    <img
      src={getTokenLogo(token_symbol)}
      alt={token_symbol}
      className="w-5 h-5 object-cover rounded-full"
    />
  );

  return (
    <div className={className}>
      <Button
        onClick={() => {
          setOpenModalWithdraw();
        }}
        variant="secondary"
        className={clsx("w-full", className)}
        disabled={disabled || max === 0}
        isLoading={isLoading}
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
        tokenSymbol={token_symbol}
        vaultSymbol={vault_symbol}
        tokenIcon={tokenIcon}
        conversionValue={conversionValue}
      />
    </div>
  );
}
