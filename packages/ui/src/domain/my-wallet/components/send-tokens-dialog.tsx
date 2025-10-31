import { Button, Input, Label, Modal, TokenAmountInput } from "@/components";
import { useSendTokens } from "@/domain/my-wallet/hooks/use-send-tokens";
import { TokenType, Tokens } from "@/domain/types/token";
import { useSelector } from "@/hooks/use-selector";
import { getNetworkConfig } from "@/shared/config/network";
import React, { useEffect, useState } from "react";
import { isAddress } from "viem";

interface SendTokensDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  tokens: Tokens;
  refetchTokensBalance: () => void;
}

export function SendTokensDialog({ isOpen, setIsOpen, tokens, refetchTokensBalance }: SendTokensDialogProps) {
  const chainName = getNetworkConfig().chain.name;

  const handleReset = () => {
    setAmount("");
    setAddress("");
    setIsInsufficientBalance(false);
    setInvalidAmount(false);
    setInvalidAddress(false);
  };

  const {
    selectedRow,
    reset: resetTokenSelector,
    change: changeTokenSelection,
  } = useSelector<TokenType>(tokens, 0, {
    onReset: handleReset,
    onChange: handleReset,
  });

  const [amount, setAmount] = useState("");
  
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false);
  const [invalidAmount, setInvalidAmount] = useState(false);
  const [invalidAddress, setInvalidAddress] = useState(false);

  
  const { sendTokens } = useSendTokens();

  const validateForm = () => {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || amount.length === 0) {
      setInvalidAmount(true);
      return false;
    }
    if (address.length === 0) {
      setInvalidAddress(true);
      return false;
    }
    return true;
  };

  const handleSendTokens = async () => {
    if (!validateForm()) return;

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
    refetchTokensBalance();

    setIsLoading(false);
    setIsOpen(false);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    setInvalidAddress(e.target.value.length > 0 && !isAddress(e.target.value));
  };

  useEffect(() => {
    if (!selectedRow) return;
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
      setInvalidAmount(true);
      setIsInsufficientBalance(false);
    } else {
      setInvalidAmount(false);
      const isInsufficientBalance = numericAmount > selectedRow.balance;
      setIsInsufficientBalance(isInsufficientBalance);
    }
  }, [amount]);

  // Reset to default selection when dialog opens
  useEffect(() => {
    if (isOpen) resetTokenSelector();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    selectedRow && (
      <Modal
        title="Send Tokens"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        blockClose={isLoading}
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
              tokenLabel={selectedRow.symbol}
              tokenIcon={
                selectedRow.icon ? React.createElement(selectedRow.icon, { size: 20 }) : undefined
              }
              tokenSecondaryLabel={`Available: $${selectedRow.balance}`}
              noEdit={isLoading}
              amount={amount}
              onAmountChange={(e) => setAmount(e.target.value)}
              onMaxClick={() => setAmount(selectedRow.balance.toString())}
              max={selectedRow.balance}
              validation={invalidAmount ? "invalid" : undefined}
              validationMessage="Invalid amount"
              selector={
                Object.keys(tokens).length > 1? {
                  onOptionSelected: (e) => {
                    changeTokenSelection(e.target.value);
                  },
                  options: Object.keys(tokens).map((token) => ({
                    label: tokens[token].symbol,
                    value: token,
                  })),
                } : undefined
              }
            />
            <Input
              label="Address"
              type="text"
              value={address}
              validation={invalidAddress ? "invalid" : undefined}
              validationMessage="Invalid address"
              onChange={handleAddressChange}
              noEdit={isLoading}
              className="!text-normal !text-textLight"
            />
          </div>
        </div>
      </Modal>
    )
  );
}
