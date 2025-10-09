import { Input, Select } from "@/components";
import { ArrowRightLeftIcon as ConversionIcon } from "lucide-react";
import React from "react";

interface TokenAmountInputProps {
  tokenLabel: string;
  tokenIcon: React.ReactNode;
  conversionLeftText?: string;
  conversionRightText?: string;
  tokenSecondaryLabel: string;
  noEdit: boolean;
  amount: string;
  onAmountChange: React.ChangeEventHandler<HTMLInputElement>;
  onMaxClick: () => void;
  max?: number;
  validation?: "invalid" | "success" | null;
  validationMessage?: string;
  selector?: {
    onOptionSelected: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: {
      label: string;
      value: string;
    }[];
  };
}

const TokenAmountInput: React.FC<TokenAmountInputProps> = ({
  tokenLabel,
  tokenIcon,
  noEdit,
  amount,
  conversionLeftText = "",
  conversionRightText = "",
  tokenSecondaryLabel,
  onAmountChange,
  onMaxClick,
  max = 1000,
  validation,
  validationMessage,
  selector,
}) => {
  const complexLabel =
    conversionLeftText && conversionRightText
      ? {
          leftText: conversionLeftText,
          icon: <ConversionIcon size={14} />,
          rightText: conversionRightText,
          align: "right" as const,
        }
      : undefined;
  return (
    <div className="flex flex-row w-full gap-3">
      {!selector && (
        <Input
          label="Amount"
          secondaryLabel={tokenSecondaryLabel}
          type="text"
          value={tokenLabel}
          onChange={() => {}}
          noEdit
          className="w-1/3 sm:w-1/4"
          leftIcon={tokenIcon}
        />
      )}
      {selector && (
        <Select
          label="Amount"
          secondaryLabel={tokenSecondaryLabel}
          onChange={selector.onOptionSelected}
          className="w-1/3"
          leftIcon={tokenIcon}
        >
          {selector.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      )}
      <Input
        label=" "
        value={amount}
        onChange={onAmountChange}
        max={max}
        onMaxClick={onMaxClick}
        noEdit={noEdit}
        complexLabel={complexLabel}
        className="w-2/3 sm:w-3/4"
        validation={validation}
        validationMessage={validationMessage}
      />
    </div>
  );
};

export default TokenAmountInput;
