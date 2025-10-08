import { Button, Input, Label, Modal, TokenAmountInput } from "@/components";
import { useSendTokens } from "@/services/shared/use-send-tokens";
import { getNetworkConfig } from "@/shared/config/network";
import React, { useEffect, useState } from "react";
import { isAddress } from "viem";

export interface TokenType {
  icon?: React.ComponentType<{ size?: number }>;
  symbol: string;
  name: string;
  balance: string;
  metadata: {
    address: string;
    decimals: number;
  };
}

export interface Tokens {
  [vaultId: string]: TokenType;
}

interface SendTokensDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  tokens: Tokens;
}

export default function SendTokensDialog({ isOpen, setIsOpen, tokens }: SendTokensDialogProps) {
  const chainName = getNetworkConfig().chain.name;
  const [amount, setAmount] = useState("");

  const defaultSelection = tokens[Object.keys(tokens)[0]];
  const [selectedRow, setSelectedRow] = useState<TokenType>(defaultSelection);
  console.log(selectedRow);
  const [tokenLabel, setTokenLabel] = useState(selectedRow.symbol);
  const [tokenIconElement, setTokenIconElement] = useState<
    React.ComponentType<{ size?: number }> | undefined
  >(selectedRow.icon);
  const [max, setMax] = useState(Number(selectedRow.balance));
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
      selectedRow.metadata.address,
      selectedRow.metadata.decimals,
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
    if (!!selectedRow) {
      setMax(Number(selectedRow.balance));
      setTokenIconElement(selectedRow.icon);
      setTokenLabel(selectedRow.symbol);
    }
  }, [selectedRow]);

  // Reset to default selection when dialog opens
  useEffect(() => {
    if (isOpen && defaultSelection) {
      setSelectedRow(defaultSelection);
      setAmount("");
      setAddress("");
      setIsInsufficientBalance(false);
      setInvalidAmount(false);
      setInvalidAddress(false);
    }
  }, [isOpen, defaultSelection]);

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
              tokenIcon={
                tokenIconElement ? React.createElement(selectedRow.icon!, { size: 20 }) : undefined
              }
              tokenSecondaryLabel={`$${max}`}
              noEdit={isLoading}
              amount={amount}
              onAmountChange={(e) => setAmount(e.target.value)}
              onMaxClick={() => setAmount(max.toString())}
              max={max}
              validation={invalidAmount ? "invalid" : undefined}
              validationMessage="Invalid amount"
              selector={{
                onOptionSelected: (e) => {
                  setSelectedRow(tokens[e.target.value]);
                },
                options: Object.keys(tokens).map((token) => ({
                  label: tokens[token].symbol,
                  value: token,
                })),
              }}
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
