import { Button } from "@/components";
//import { getTokenLogo } from "@/components/token-icons";
import { useModal } from "@/hooks/use-modal";
import { useWithdraw } from "@/services/lagoon/use-withdraw";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { WithdrawModal } from "./components";
import { useFundOperateData } from "./hooks/use-fund-operate-data";

interface WithdrawProps {
  vaultId: string;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function Withdraw({
  vaultId,
  className,
  disabled,
  isLoading,
}: WithdrawProps) {
  const { useWithdrawData } = useFundOperateData(vaultId);
  const [amount, setAmount] = useState("");
  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false);
  const [invalidAmount, setInvalidAmount] = useState(false);

  const {
    position: max,
    conversionValue,
    vault_address,
    token_symbol,
    vault_symbol,
    vault_decimals,
    positionUSD,
    getConvertedValue,
  } = useWithdrawData();

  const {
    isOpen: openModalWithdraw,
    open: setOpenModalWithdraw,
    close: setCloseModalWithdraw,
  } = useModal(false);

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

    // Execute transaction
    const tx = await submitRequestWithdraw(vault_address, vault_decimals!, amount);

    // Wait for confirmation
    await tx.wait();

    setCloseModalWithdraw();
  };

  return (
    <div className={className}>
      <Button
        onClick={() => {
          setOpenModalWithdraw();
        }}
        variant="secondary"
        className={clsx("w-full", className)}
        disabled={disabled || max === 0}
        isLoading={isLoading || false} // TODO: Add loading state
      >
        Withdraw
      </Button>

      <WithdrawModal
        open={openModalWithdraw}
        onClose={() => setCloseModalWithdraw()}
        amount={amount}
        convertedAmount={getConvertedValue(Number(amount))}
        onAmountChange={(e) => setAmount(e.target.value)}
        onMaxClick={() => setAmount(max.toString())}
        max={max}
        position={max}
        conversionValue={conversionValue}
        positionConverted={positionUSD.toString()}
        onWithdraw={() => handleWithdraw()}
        isLoading={isLoading || false} // TODO: Add loading state
        isInsufficientShares={isInsufficientBalance}
        invalidAmount={invalidAmount}
        tokenSymbol={token_symbol}
        vaultSymbol={vault_symbol}
        //tokenIcon={tokenIcon}
      />
    </div>
  );
}
