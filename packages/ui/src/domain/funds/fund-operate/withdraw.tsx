import { Button } from "@/components";
//import { getTokenLogo } from "@/components/token-icons";
import { useModal } from "@/hooks/use-modal";
import { useWithdraw } from "@/services/lagoon/use-withdraw";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { WithdrawModal } from "./components";
import { getConvertedValue } from "./utils/get-conversion-value";
import { Vault } from "@/shared/types";
import { useTokensBalance } from "@/services/shared/use-tokens-balance";

interface WithdrawProps {
  vault: Vault;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function Withdraw({
  vault,
  className,
  disabled,
  isLoading,
}: WithdrawProps) {
  const [amount, setAmount] = useState("");
  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false);
  const [invalidAmount, setInvalidAmount] = useState(false);

  const { data: tokensBalance } = useTokensBalance([vault]);
  const max = Number(tokensBalance?.vaultBalances[vault.id]?.availableSupply || 0);

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
    const tx = await submitRequestWithdraw(vault.address, vault.decimals, amount);

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
        convertedAmount={getConvertedValue(Number(amount), vault)}
        onAmountChange={(e) => setAmount(e.target.value)}
        onMaxClick={() => setAmount(max.toString())}
        max={max}
        position={max}
        conversionValue={getConvertedValue(Number(amount), vault)}
        positionConverted={"0"} // TODO: Add positionUSD
        onWithdraw={handleWithdraw}
        isLoading={isLoading || false} // TODO: Add loading state
        isInsufficientShares={isInsufficientBalance}
        invalidAmount={invalidAmount}
        tokenSymbol={vault.tokenSymbol}
        vaultSymbol={vault.symbol}
      />
    </div>
  );
}
