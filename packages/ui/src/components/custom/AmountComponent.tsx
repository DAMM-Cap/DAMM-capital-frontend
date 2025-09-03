import React from "react";
import Input from "../core/Input";
import ConversionIcon from "../icons/ConversionIcon";

interface AmountComponentProps {
  tokenLabel: string;
  tokenIcon: React.ReactNode;
  conversionLeftText: string;
  conversionRightText: string;
  tokenSecondaryLabel: string;
  amount: string;
  onAmountChange: (value: string) => void;
  onMaxClick: () => void;
  max?: number;
}

const AmountComponent: React.FC<AmountComponentProps> = ({
  tokenLabel,
  tokenIcon,
  amount,
  conversionLeftText,
  conversionRightText,
  tokenSecondaryLabel,
  onAmountChange,
  onMaxClick,
  max = 1000,
}) => {
  return (
    <div className="flex flex-row w-full gap-3">
      <Input
        label="Amount"
        secondaryLabel={tokenSecondaryLabel}
        type="text"
        value={tokenLabel}
        onChange={() => {}}
        noEdit
        className="w-1/4"
        leftIcon={tokenIcon}
      />
      <Input
        label=" "
        value={amount}
        onChange={onAmountChange}
        max={max}
        onMaxClick={onMaxClick}
        complexLabel={{
          leftText: conversionLeftText,
          icon: <ConversionIcon />,
          rightText: conversionRightText,
          align: "right",
        }}
        className="w-3/4"
      />
    </div>
  );
};

export default AmountComponent;
