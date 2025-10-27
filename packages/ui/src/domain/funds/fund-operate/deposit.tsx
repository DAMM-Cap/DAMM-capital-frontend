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
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function Deposit({
  vaultId,  
  className,
  disabled,
}: DepositProps) {
  const { useDepositData } = useFundOperateData(vaultId);

  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [referral, setReferral] = useState("");
  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false);
  const [invalidAmount, setInvalidAmount] = useState(false);
  const [invalidReferral, setInvalidReferral] = useState(false);
  const [validReferral, setValidReferral] = useState(false);

  const {
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
    convertAssetsAmountToShares,
  } = useDepositData();

  const {
    isOpen: openModal,
    open: setOpenModal,
    close: setCloseModal,
  } = useModal(false);
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
    setTxHash(tx.hash ?? "");
    setOpenModalInProgress();
  };

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
        isLoading={false} // TODO: Add loading state
      >
        Deposit
      </Button>
      <DepositModal
        open={openModal}
        onClose={setCloseModal}
        amount={amount}
        convertedAmount={convertAssetsAmountToShares(Number(amount))}
        onAmountChange={(e) => setAmount(e.target.value)}
        onMaxClick={() => setAmount(max.toString())}
        max={max}
        walletBalance={max}
        conversionValue={conversionValue}
        referralCode={referral}
        invalidReferral={invalidReferral}
        validReferral={validReferral}
        onReferralCodeChange={(e) => setReferral(e.target.value)}
        onDeposit={handleDeposit}
        isLoading={false} // TODO: Add loading state
        isInsufficientBalance={isInsufficientBalance}
        invalidAmount={invalidAmount}
        tokenSymbol={token_symbol}
        vaultSymbol={vault_symbol}
        tokenIcon={tokenIcon}
      />

      <DepositInProgressModal
        openModalInProgress={openModalInProgress}
        setOpenModalInProgress={toggleModalInProgress}
        txHash={txHash}
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
