import React from "react";
import Button from "../core/Button";
import Input from "../core/Input";
import Label from "../core/Label";
import Modal, { ModalActionButtons, ModalContents } from "../core/Modal";
import DammStableIcon from "../icons/DammStableIcon";
import AmountComponent from "./AmountComponent";
import TitleComponent from "./TitleComponent";

interface DepositModalProps {
  open: boolean;
  onClose: () => void;
  amount: string;
  onAmountChange: (value: string) => void;
  onMaxClick: () => void;
  max?: number;
  referralCode: string;
  onReferralCodeChange: (value: string) => void;
  onDeposit: () => void;
  isLoading: boolean;
  isInsufficientBalance: boolean;
}

const DepositModal: React.FC<DepositModalProps> = ({
  open,
  onClose,
  amount,
  onAmountChange,
  onMaxClick,
  max = 1000,
  referralCode,
  onReferralCodeChange,
  onDeposit,
  isLoading,
  isInsufficientBalance,
}) => {
  return (
    <Modal title="Deposit" open={open} onClose={onClose}>
      <ModalContents>
        <TitleComponent
          label="My position"
          title="0 DUSDC"
          leftIcon={<DammStableIcon />}
          secondaryTitle="$0"
        />
        <AmountComponent
          tokenLabel="DUSDC"
          tokenIcon={<DammStableIcon size={20} />}
          tokenSecondaryLabel="$0"
          conversionLeftText="1 USDC"
          conversionRightText="0.935 DAMM USDC"
          amount={amount}
          onAmountChange={onAmountChange}
          onMaxClick={onMaxClick}
          max={max}
        />
        <Input
          label="Referral code"
          type="text"
          value={referralCode}
          placeholder="Type here"
          onChange={onReferralCodeChange}
          className="w-full"
        />
        <div className="flex flex-col gap-2 pt-4 pb-4">
          <Label label="Completion time" secondaryLabel="~ 48 hours" />
          <Label label="Note: You can cancel your deposit before it's confirmed." />
        </div>
      </ModalContents>
      <ModalActionButtons>
        <Button
          onClick={onDeposit}
          variant={isInsufficientBalance ? "disabled" : "primary"}
          isLoading={isLoading}
        >
          {isInsufficientBalance ? "Insufficient balance" : "Deposit"}
        </Button>
      </ModalActionButtons>
    </Modal>
  );
};

export default DepositModal;
