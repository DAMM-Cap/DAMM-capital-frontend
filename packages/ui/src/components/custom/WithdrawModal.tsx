import React from "react";
import Button from "../core/Button";
import Label from "../core/Label";
import Modal from "../core/Modal";
import TitleLabel from "./TitleLabel";
import TokenAmountInput from "./TokenAmountInput";

interface WithdrawModalProps {
  open: boolean;
  onClose: () => void;
  amount: string;
  onAmountChange: React.ChangeEventHandler<HTMLInputElement>;
  onMaxClick: () => void;
  max: number;
  position: number;
  positionConverted: number;
  onWithdraw: () => void;
  isLoading: boolean;
  isInsufficientShares: boolean;
  invalidAmount: boolean;
  tokenSymbol: string;
  tokenIcon: React.ReactNode;
  conversionValue: number;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  open,
  onClose,
  amount,
  onAmountChange,
  onMaxClick,
  max,
  position,
  positionConverted,
  onWithdraw,
  isLoading,
  isInsufficientShares,
  invalidAmount,
  tokenSymbol,
  tokenIcon: TokenIcon,
  conversionValue,
}) => {
  return (
    <Modal
      title="Withdraw"
      open={open}
      onClose={onClose}
      actions={() => (
        <Button
          onClick={onWithdraw}
          variant="primary"
          isLoading={isLoading}
          disabled={isInsufficientShares || invalidAmount}
          className="w-full"
        >
          {isInsufficientShares ? "Insufficient shares" : "Request Withdraw"}
        </Button>
      )}
    >
      <TitleLabel
        label="My claimable shares"
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
      <div className="flex flex-col gap-2 pt-0 pb-4">
        <Label label="Completion time" secondaryLabel="~ 48 hours" />
      </div>
    </Modal>
  );
};

export default WithdrawModal;
