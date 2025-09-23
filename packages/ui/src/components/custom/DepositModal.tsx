import React from "react";
import Button from "../core/Button";
import Input from "../core/Input";
import Label from "../core/Label";
import Modal from "../core/Modal";
import TitleLabel from "./TitleLabel";
import TokenAmountInput from "./TokenAmountInput";

interface DepositModalProps {
  open: boolean;
  onClose: () => void;
  amount: string;
  onAmountChange: React.ChangeEventHandler<HTMLInputElement>;
  onMaxClick: () => void;
  max: number;
  position: number;
  positionConverted: number;
  referralCode: string;
  onReferralCodeChange: React.ChangeEventHandler<HTMLInputElement>;
  onDeposit: () => void;
  isLoading: boolean;
  isInsufficientBalance: boolean;
  invalidAmount: boolean;
  invalidReferral: boolean;
  validReferral: boolean;
  tokenSymbol: string;
  tokenIcon: React.ReactNode;
  conversionValue: number;
}

const DepositModal: React.FC<DepositModalProps> = ({
  open,
  onClose,
  amount,
  onAmountChange,
  onMaxClick,
  max,
  position,
  positionConverted,
  referralCode,
  onReferralCodeChange,
  onDeposit,
  isLoading,
  isInsufficientBalance,
  invalidAmount,
  invalidReferral,
  validReferral,
  tokenSymbol,
  tokenIcon: TokenIcon,
  conversionValue,
}) => {
  return (
    <Modal
      title="Deposit"
      open={open}
      onClose={onClose}
      actions={() => (
        <Button
          onClick={onDeposit}
          variant="primary"
          isLoading={isLoading}
          disabled={isInsufficientBalance || invalidAmount || invalidReferral}
          className="w-full"
        >
          {isInsufficientBalance ? "Insufficient balance" : "Deposit"}
        </Button>
      )}
    >
      <TitleLabel
        label="My position"
        title={`${position} ${tokenSymbol}`}
        leftIcon={TokenIcon}
        secondaryTitle={`$${positionConverted}`}
      />
      <TokenAmountInput
        tokenLabel={tokenSymbol}
        tokenIcon={TokenIcon}
        tokenSecondaryLabel={`$${max}`}
        conversionLeftText="1 USDC"
        conversionRightText={`${conversionValue} ${tokenSymbol}`}
        amount={amount}
        onAmountChange={onAmountChange}
        onMaxClick={onMaxClick}
        max={max}
        noEdit={isLoading}
        validation={invalidAmount ? "invalid" : undefined}
        validationMessage="Invalid amount"
      />
      <Input
        label="Referral code"
        type="text"
        value={referralCode}
        noEdit={isLoading}
        placeholder="Type here"
        onChange={onReferralCodeChange}
        className="w-full pt-4"
        validation={invalidReferral ? "invalid" : validReferral ? "success" : undefined}
        validationMessage={
          validReferral ? "Referral address validated" : "Invalid referral address"
        }
      />
      <div className="flex flex-col gap-2 pt-0 pb-4">
        <Label label="Completion time" secondaryLabel="~ 48 hours" />
        <Label label="Note: You can cancel your deposit before it's confirmed." />
      </div>
    </Modal>
  );
};

export default DepositModal;
