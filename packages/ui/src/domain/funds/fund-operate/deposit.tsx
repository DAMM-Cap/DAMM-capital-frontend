import { Button, DammStableIcon } from "@/components";
import { useModal } from "@/hooks/use-modal";
import { useDeposit } from "@/services/lagoon/use-deposit";
import { LogInIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  AcknowledgeTermsModal,
  DepositInProgressModal,
  DepositModal,
  WhitelistingModal,
} from "./components";
import { useFundOperateData } from "./hooks/use-fund-operate-data";

interface DepositProps {
  vaultId: string;
  handleLoading: (isLoading: boolean) => void;
}

export default function Deposit({ vaultId, handleLoading }: DepositProps) {
  const max = 1000;
  const { useDepositData, isLoading: vaultLoading } = useFundOperateData(vaultId);

  const [amount, setAmount] = useState("");
  const [referral, setReferral] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false);
  const [invalidAmount, setInvalidAmount] = useState(false);
  const [invalidReferral, setInvalidReferral] = useState(false);
  const [validReferral, setValidReferral] = useState(false);

  const {
    isOpen: openModal,
    open: setOpenModal,
    close: setCloseModal,
  } = useModal(false, { onClose: () => setIsLoading(false) });
  const {
    isOpen: openModalInProgress,
    open: setOpenModalInProgress,
    toggle: toggleModalInProgress,
  } = useModal(false);
  const {
    isOpen: openModalWhitelisting,
    open: setOpenModalWhitelisting,
    toggle: toggleModalWhitelisting,
  } = useModal(false);
  const {
    isOpen: openModalTerms,
    open: setOpenModalTerms,
    toggle: toggleModalTerms,
  } = useModal(false);

  const { submitRequestDeposit } = useDeposit();

  useEffect(() => {
    handleLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    const hasReferral = referral.length > 0;
    const isValid = hasReferral && referral.startsWith("0x") && referral.length >= 4;
    setValidReferral(isValid);
    setInvalidReferral(hasReferral && !isValid);
  }, [referral]);

  useEffect(() => {
    const numericAmount = Number(amount);
    const isNanAmount = isNaN(numericAmount);
    setInvalidAmount(isNanAmount);
    setIsInsufficientBalance(!isNanAmount && numericAmount > max);
  }, [amount]);

  // Don't render if vault is not found or still loading
  if (vaultLoading) {
    return null;
  }

  const {
    position,
    conversionValue,
    vault_address,
    token_address,
    token_decimals,
    fee_receiver_address,
    entranceRate,
  } = useDepositData();

  const handleDeposit = async () => {
    setIsLoading(true);

    // Execute transaction
    const tx = await submitRequestDeposit(
      vault_address,
      token_address,
      token_decimals,
      fee_receiver_address,
      entranceRate,
      amount,
    );

    // Wait for confirmation
    await tx.wait();

    setCloseModal();
    setOpenModalInProgress();
  };

  return (
    <div>
      <Button
        onClick={() => {
          setOpenModal();
          setOpenModalWhitelisting();
          setOpenModalTerms();
        }}
        className="w-full"
      >
        <LogInIcon size={16} />
        Deposit
      </Button>
      <DepositModal
        open={openModal}
        onClose={() => setCloseModal()}
        amount={amount}
        onAmountChange={(e) => setAmount(e.target.value)}
        onMaxClick={() => setAmount(max.toString())}
        max={max}
        position={position}
        conversionValue={conversionValue}
        positionConverted={position * conversionValue}
        referralCode={referral}
        invalidReferral={invalidReferral}
        validReferral={validReferral}
        onReferralCodeChange={(e) => setReferral(e.target.value)}
        onDeposit={() => handleDeposit()}
        isLoading={isLoading}
        isInsufficientBalance={isInsufficientBalance}
        invalidAmount={invalidAmount}
        tokenSymbol="DUSDC"
        tokenIcon={<DammStableIcon size={20} />}
      />

      <DepositInProgressModal
        openModalInProgress={openModalInProgress}
        setOpenModalInProgress={toggleModalInProgress}
      />

      <WhitelistingModal
        openModalWhitelisting={openModalWhitelisting}
        setOpenModalWhitelisting={toggleModalWhitelisting}
      />
      <AcknowledgeTermsModal openModalTerms={openModalTerms} setOpenModalTerms={toggleModalTerms} />
    </div>
  );
}
