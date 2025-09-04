import { Button, DammStableIcon, DepositModal } from "@/components";
import EnterIcon from "@/components/icons/EnterIcon";
import RedeemIcon from "@/components/icons/RedeemIcon";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/deposit/")({
  component: Deposit,
});

function Deposit() {
  const max = 1000;
  const position = 3500;
  const conversionValue = 0.935;
  const [amount, setAmount] = useState("");
  const [referral, setReferral] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false);
  const [invalidAmount, setInvalidAmount] = useState(false);
  const [invalidReferral, setInvalidReferral] = useState(false);
  const [validReferral, setValidReferral] = useState(false);

  useEffect(() => {
    if (referral.length > 0) {
      if (referral.startsWith("0x") && referral.length >= 4) {
        setInvalidReferral(false);
        setValidReferral(true);
      } else {
        setInvalidReferral(true);
        setValidReferral(false);
      }
    } else {
      setInvalidReferral(false);
      setValidReferral(false);
    }
  }, [referral]);

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

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsLoading(false);
  };

  const handleDeposit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOpenModal(false);
    }, 4000);
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col gap-4">
        {/* Button custom */}

        <Button onClick={() => setOpenModal(true)}>
          <EnterIcon />
          Deposit
        </Button>

        <Button onClick={() => {}}>
          <RedeemIcon />
          Withdraw
        </Button>

        {/* Modal */}
        <DepositModal
          open={openModal}
          onClose={() => handleCloseModal()}
          amount={amount}
          onAmountChange={setAmount}
          onMaxClick={() => setAmount(max.toString())}
          max={max}
          position={position}
          conversionValue={conversionValue}
          positionConverted={position * conversionValue}
          referralCode={referral}
          invalidReferral={invalidReferral}
          validReferral={validReferral}
          onReferralCodeChange={setReferral}
          onDeposit={() => handleDeposit()}
          isLoading={isLoading}
          isInsufficientBalance={isInsufficientBalance}
          invalidAmount={invalidAmount}
          tokenSymbol="DUSDC"
          tokenIcon={<DammStableIcon size={20} />}
        />
      </div>
    </div>
  );
}
