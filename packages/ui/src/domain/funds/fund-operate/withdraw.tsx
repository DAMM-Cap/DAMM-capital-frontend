import { Button, DammStableIcon } from "@/components";
import { useModal } from "@/hooks/use-modal";
import { useWithdraw } from "@/services/lagoon/use-withdraw";
import { LogOutIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { WithdrawModal } from "./components";
import { useFundOperateData } from "./hooks/use-fund-operate-data";

interface WithdrawProps {
  vaultId: string;
  handleLoading: (isLoading: boolean) => void;
}

export default function Withdraw({ vaultId, handleLoading }: WithdrawProps) {
  const { useWithdrawData, isLoading: vaultLoading } = useFundOperateData(vaultId);
  const [amount, setAmount] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false);
  const [invalidAmount, setInvalidAmount] = useState(false);

  const {
    position,
    conversionValue,
    vault_address,
    availableToRedeemRaw,
    vault_status,
    token_symbol,
    token_address,
    fee_receiver_address,
    exitRate,
    availableAssets: max,
  } = useWithdrawData();

  const {
    isOpen: openModalWithdraw,
    open: setOpenModalWithdraw,
    close: setCloseModalWithdraw,
  } = useModal(false, { onClose: () => setIsLoading(false) });

  const { submitRedeem, submitRequestWithdraw } = useWithdraw();

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

  const handleRedeem = async () => {
    setIsLoading(true);

    // Execute transaction
    const amount = String(availableToRedeemRaw);
    // Execute transaction
    const tx = await submitRedeem(
      vault_address,
      token_address,
      fee_receiver_address,
      exitRate,
      amount,
    );

    // Wait for confirmation
    await tx.wait();

    setCloseModalWithdraw();
  };

  // Don't render if vault is not found or still loading
  if (vaultLoading) {
    return null;
  }

  return (
    <div>
      {(availableToRedeemRaw && availableToRedeemRaw > 0) || vault_status !== "open" ? (
        <Button onClick={() => handleRedeem()} className="w-full">
          <LogOutIcon size={16} />
          <span>
            {availableToRedeemRaw} {token_symbol}
          </span>
        </Button>
      ) : (
        <Button
          onClick={() => {
            setOpenModalWithdraw();
          }}
          variant="secondary"
          className="w-full"
        >
          <LogOutIcon size={16} />
          Withdraw
        </Button>
      )}

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
