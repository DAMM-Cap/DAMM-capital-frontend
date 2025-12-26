import { Button, Label, Modal, TitleLabel, TokenAmountInput } from "@/components";
import React from "react";

interface WithdrawModalProps {
  open: boolean;
  onClose: () => void;
  amount: string;
  onAmountChange: React.ChangeEventHandler<HTMLInputElement>;
  onMaxClick: () => void;
  max: number;
  position: number;
  positionConverted: string;
  onWithdraw: () => void;
  isLoading: boolean;
  isInsufficientShares: boolean;
  invalidAmount: boolean;
  //tokenSymbol: string;
  vaultSymbol: string;
  //tokenIcon: React.ReactNode;
  vaultIcon: React.ReactNode;
  selectedTokenSymbol: string;
  selectedTokenIcon: React.ReactNode;
  secondaryTokenSymbol: string;
  //secondaryTokenIcon: React.ReactNode;
  conversionValue: number;
  convertedAmount: number;
  selector?: {
    onOptionSelected: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: {
      label: string;
      value: string;
    }[];
  };
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
  //tokenSymbol,
  vaultSymbol,
  vaultIcon,
  selectedTokenSymbol,
  selectedTokenIcon,
  secondaryTokenSymbol,
  //secondaryTokenIcon,
  //tokenIcon,
  conversionValue,
  convertedAmount,
  selector,
}) => {
  return (
    <Modal
      title="Withdraw"
      open={open}
      onClose={onClose}
      blockClose={isLoading}
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
        title={`${position} ${vaultSymbol}`}
        leftIcon={vaultIcon}
        secondaryTitle={positionConverted}
      />
      <TokenAmountInput
        tokenLabel={selectedTokenSymbol}
        //tokenIcon={<DammStableIcon />}
        tokenIcon={selectedTokenIcon}
        /* tokenLabel={tokenSymbol}
        tokenIcon={TokenIcon} */
        tokenSecondaryLabel={`${convertedAmount} $${secondaryTokenSymbol}`}
        //tokenSecondaryLabel={`$${max}`}
        conversionLeftText={`1 ${selectedTokenSymbol}`}
        conversionRightText={`${conversionValue} $${secondaryTokenSymbol}`}
        amount={amount}
        onAmountChange={onAmountChange}
        onMaxClick={onMaxClick}
        max={max}
        noEdit={isLoading}
        validation={invalidAmount ? "invalid" : undefined}
        validationMessage="Invalid amount"
        selector={selector}
      />
      <div className="flex flex-col gap-2 pt-0 pb-4">
        <Label label="Completion time" secondaryLabel="~ 48 hours" />
      </div>
    </Modal>
  );
};

export default WithdrawModal;
