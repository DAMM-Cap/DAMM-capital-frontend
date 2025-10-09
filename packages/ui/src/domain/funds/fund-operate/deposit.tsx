import { Button } from "@/components";
import { getTokenLogo } from "@/components/token-icons";
import { useModal } from "@/hooks/use-modal";
import { useDeposit } from "@/services/lagoon/use-deposit";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { DepositInProgressModal, DepositModal, WhitelistingModal } from "./components";
import InsufficientBalanceModal from "./components/insufficient-balance-modal";
import { useFundOperateData } from "./hooks/use-fund-operate-data";

interface DepositProps {
  vaultId: string;
  handleLoading: (isLoading: boolean) => void;
  className?: string;
  disabled?: boolean;
  isLoading: boolean;
}

export default function Deposit({
  vaultId,
  handleLoading,
  className,
  disabled,
  isLoading,
}: DepositProps) {
  const { useDepositData, isLoading: vaultLoading } = useFundOperateData(vaultId);

  const [amount, setAmount] = useState("");
  const [referral, setReferral] = useState("");
  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false);
  const [invalidAmount, setInvalidAmount] = useState(false);
  const [invalidReferral, setInvalidReferral] = useState(false);
  const [validReferral, setValidReferral] = useState(false);

  const {
    position,
    conversionValue,
    vault_address,
    token_address,
    token_decimals,
    token_symbol,
    vault_symbol,
    fee_receiver_address,
    entranceRate,
    walletBalance: max,
    isUserWhitelisted,
  } = useDepositData();

  const {
    isOpen: openModal,
    open: setOpenModal,
    close: setCloseModal,
  } = useModal(false, { onClose: () => handleLoading(false) });
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
    isOpen: openModalInsufficientBalance,
    open: setOpenModalInsufficientBalance,
    toggle: toggleModalInsufficientBalance,
  } = useModal(false);

  const { submitRequestDeposit } = useDeposit();

  const validateForm = () => {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || amount.length === 0) {
      setInvalidAmount(true);
      return false;
    }
    return true;
  };

  useEffect(() => {
    const hasReferral = referral.length > 0;
    const isValid = hasReferral && referral.length >= 4;
    setValidReferral(isValid);
    setInvalidReferral(hasReferral && !isValid);
  }, [referral]);

  useEffect(() => {
    const numericAmount = Number(amount);
    const isNanAmount = isNaN(numericAmount);
    setInvalidAmount(isNanAmount);
    setIsInsufficientBalance(!isNanAmount && numericAmount > max);
  }, [amount]);

  const handleDeposit = async () => {
    if (!validateForm()) return;
    handleLoading(true);

    // Execute transaction
    const tx = await submitRequestDeposit(
      vault_address,
      referral,
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
          if (max === 0) {
            setOpenModalInsufficientBalance();
          } else {
            if (!isUserWhitelisted) {
              setOpenModalWhitelisting();
            } else {
              setOpenModal();
            }
          }
        }}
        className={clsx("w-full", className)}
        disabled={disabled}
        isLoading={isLoading}
      >
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
        tokenSymbol={token_symbol}
        vaultSymbol={vault_symbol}
        tokenIcon={tokenIcon}
      />

      <DepositInProgressModal
        openModalInProgress={openModalInProgress}
        setOpenModalInProgress={toggleModalInProgress}
      />

      <WhitelistingModal
        openModalWhitelisting={openModalWhitelisting}
        setOpenModalWhitelisting={toggleModalWhitelisting}
      />

      <InsufficientBalanceModal
        openModalInsufficientBalance={openModalInsufficientBalance}
        setOpenModalInsufficientBalance={toggleModalInsufficientBalance}
      />
    </div>
  );
}
