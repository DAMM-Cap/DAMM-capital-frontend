import { Button, Input, Label, Modal, TitleLabel, TokenAmountInput } from "@/components";
import React from "react";

interface DepositModalProps {
  open: boolean;
  onClose: () => void;
  amount: string;
  onAmountChange: React.ChangeEventHandler<HTMLInputElement>;
  onMaxClick: () => void;
  max: number;
  walletBalance: number;
  referralCode: string;
  onReferralCodeChange: React.ChangeEventHandler<HTMLInputElement>;
  onDeposit: () => void;
  isLoading: boolean;
  isInsufficientBalance: boolean;
  invalidAmount: boolean;
  invalidReferral: boolean;
  validReferral: boolean;
  tokenSymbol: string;
  vaultSymbol: string;
  tokenIcon: React.ReactNode;
  conversionValue: number;
  convertedAmount: number;
}

const DepositModal: React.FC<DepositModalProps> = ({
  open,
  onClose,
  amount,
  onAmountChange,
  onMaxClick,
  max,
  walletBalance,
  referralCode,
  onReferralCodeChange,
  onDeposit,
  isLoading,
  isInsufficientBalance,
  invalidAmount,
  invalidReferral,
  validReferral,
  tokenSymbol,
  vaultSymbol,
  tokenIcon: TokenIcon,
  conversionValue,
  convertedAmount,
}) => {
  return (
    <Modal
      title="Deposit"
      open={open}
      onClose={onClose}
      blockClose={isLoading}
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
        label="My wallet balance"
        title={`${walletBalance} ${tokenSymbol}`}
        leftIcon={TokenIcon}
      />
      <TokenAmountInput
        tokenLabel={tokenSymbol}
        tokenIcon={TokenIcon}
        tokenSecondaryLabel={`$${convertedAmount} ${vaultSymbol}`}
        conversionLeftText={`1 ${tokenSymbol}`}
        conversionRightText={`${conversionValue} ${vaultSymbol}`}
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
