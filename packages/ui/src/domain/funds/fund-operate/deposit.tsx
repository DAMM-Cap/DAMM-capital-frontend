import { Button, DammStableIcon } from "@/components";
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

  const [openModal, setOpenModal] = useState(false);
  const [openModalInProgress, setOpenModalInProgress] = useState(false);
  const [openModalWhitelisting, setOpenModalWhitelisting] = useState(false);
  const [openModalTerms, setOpenModalTerms] = useState(false);

  const { submitRequestDeposit } = useDeposit();

  useEffect(() => {
    handleLoading(isLoading);
  }, [isLoading]);

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

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsLoading(false);
  };

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

    setIsLoading(false);
    setOpenModal(false);
    setOpenModalInProgress(true);
  };

  return (
    <div>
      <Button
        onClick={() => {
          setOpenModal(true);
          setOpenModalWhitelisting(true);
          setOpenModalTerms(true);
        }}
        className="w-full"
      >
        <LogInIcon size={16} />
        Deposit
      </Button>
      <DepositModal
        open={openModal}
        onClose={() => handleCloseModal()}
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
        setOpenModalInProgress={setOpenModalInProgress}
      />

      <WhitelistingModal
        openModalWhitelisting={openModalWhitelisting}
        setOpenModalWhitelisting={setOpenModalWhitelisting}
      />
      <AcknowledgeTermsModal
        openModalTerms={openModalTerms}
        setOpenModalTerms={setOpenModalTerms}
      />
    </div>
  );
}
