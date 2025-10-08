import { Button, Input, Label, Modal, TokenAmountInput } from "@/components";
import { useSendTokens } from "@/services/shared/use-send-tokens";
import { getNetworkConfig } from "@/shared/config/network";
import React, { useEffect, useState } from "react";
import { isAddress } from "viem";

interface RowFieldsType {
  leftIcon?: React.ComponentType<{ size?: number }>;
  value: string;
}

interface SendTokensDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  token: {
    tokenData: RowFieldsType;
    tokenBalance: RowFieldsType;
    metadata: {
      tokenAddress: string;
      tokenDecimals: number;
    };
  };
}

export default function SendTokensDialog({ isOpen, setIsOpen, token }: SendTokensDialogProps) {
  const chainName = getNetworkConfig().chain.name;
  const [amount, setAmount] = useState("");

  const [selectedRow, setSelectedRow] = useState<RowFieldsType | undefined>();
  const [tokenLabel, setTokenLabel] = useState("");
  const [tokenIconElement, setTokenIconElement] = useState<React.ReactNode | undefined>();
  const [max, setMax] = useState(0);
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false);
  const [invalidAmount, setInvalidAmount] = useState(false);
  const [invalidAddress, setInvalidAddress] = useState(false);
  const { sendTokens } = useSendTokens();

  const handleSendTokens = async () => {
    setIsLoading(true);

    // Execute transaction
    const tx = await sendTokens(
      token.metadata.tokenAddress,
      token.metadata.tokenDecimals,
      address,
      amount,
    );

    // Wait for confirmation
    await tx.wait();

    setIsLoading(false);
    setIsOpen(false);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    setInvalidAddress(e.target.value.length > 0 && !isAddress(e.target.value));
  };

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

  useEffect(() => {
    if (token) {
      const selectedRow = token;
      setSelectedRow(selectedRow.tokenData);
      setMax(Number(selectedRow.tokenBalance.value));
      const tokenIcon: React.ComponentType<{ size?: number }> | undefined = selectedRow.tokenData
        .leftIcon
        ? selectedRow.tokenData.leftIcon
        : undefined;
      const tokenIconElement = tokenIcon ? React.createElement(tokenIcon, { size: 20 }) : undefined;
      setTokenIconElement(tokenIconElement);
      setTokenLabel(selectedRow.tokenData.value);
    }
  }, [token]);

  if (!isOpen) return null;

  return (
    selectedRow && (
      <Modal
        title="Send Tokens"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        actions={() => (
          <Button
            className="w-full"
            onClick={handleSendTokens}
            variant="primary"
            isLoading={isLoading}
            disabled={isInsufficientBalance || invalidAmount || invalidAddress}
          >
            {isInsufficientBalance ? "Insufficient balance" : "Send"}
          </Button>
        )}
      >
        <div className="flex flex-col w-full items-left gap-2">
          <Label
            label={`Only send to recipients that support assets on ${chainName}. Deposits for other networks may not arrive and can be permanently lost.`}
            className="!text-normal !text-textLight"
          />

          <div className="flex flex-col w-full items-left gap-4 mt-8 mb-4">
            <TokenAmountInput
              tokenLabel={tokenLabel}
              tokenIcon={tokenIconElement}
              tokenSecondaryLabel={`$${max}`}
              noEdit={isLoading}
              amount={amount}
              onAmountChange={(e) => setAmount(e.target.value)}
              onMaxClick={() => setAmount(max.toString())}
              max={max}
              validation={invalidAmount ? "invalid" : undefined}
              validationMessage="Invalid amount"
            />
            <Input
              label="Address"
              type="text"
              value={address}
              validation={invalidAddress ? "invalid" : undefined}
              validationMessage="Invalid address"
              onChange={handleAddressChange}
              disabled={isLoading}
              className="!text-normal !text-textLight"
            />
          </div>
        </div>
      </Modal>
    )
  );
}
