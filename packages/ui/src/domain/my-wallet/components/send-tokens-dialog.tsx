import { Button, Input, Label, Modal, TokenAmountInput } from "@/components";
import { useSendTokens } from "@/services/shared/use-send-tokens";
import { getNetworkConfig } from "@/shared/config/network";
import React, { useEffect, useState } from "react";
import { Address, isAddress } from "viem";
import { useGetMax } from "../hooks/use-get-max";
import { useSession } from "@/context/session-context";

export interface TokenType {
  icon: string;
  symbol: string;
  name: string;
  metadata: {
    address: Address;
    decimals: number;
  };
}

export interface Tokens {
  [vaultId: Address]: TokenType;
}

interface SendTokensDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  tokens: Tokens;
}

export default function SendTokensDialog({ isOpen, setIsOpen, tokens }: SendTokensDialogProps) {
  const chainName = getNetworkConfig().chain.name;
  const [amount, setAmount] = useState("");
  const defaultSelection = tokens[Object.keys(tokens)[0] as Address];
  const [selectedRow, setSelectedRow] = useState<TokenType>(defaultSelection);
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false);
  const [invalidAmount, setInvalidAmount] = useState(false);
  const [invalidAddress, setInvalidAddress] = useState(false);

  const { evmAddress } = useSession();
  const { sendTokens } = useSendTokens();
  const { maxBalance: max = "0" } = useGetMax(
    selectedRow.metadata.address,
    selectedRow.metadata.decimals,
    evmAddress as Address,
  );

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
      const isInsufficientBalance = numericAmount > Number(max);
      setIsInsufficientBalance(isInsufficientBalance);
    }
  }, [amount, max]);

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
                <img
                  src={selectedRow.icon}
                  alt={selectedRow.symbol}
                  className="w-5 h-5 object-cover rounded-full"
                />
              }
              tokenSecondaryLabel={`Available: $${max}`}
              noEdit={isLoading}
              amount={amount}
              onAmountChange={(e) => setAmount(e.target.value)}
              onMaxClick={() => setAmount(max.toString())}
              max={Number(max)}
              validation={invalidAmount ? "invalid" : undefined}
              validationMessage="Invalid amount"
              selector={{
                onOptionSelected: (e) => {
                  setSelectedRow(tokens[e.target.value as Address]);
                  setAmount("");
                  setInvalidAmount(false);
                  setAddress("");
                  setInvalidAddress(false);
                },
                options: Object.keys(tokens).map((token) => ({
                  label: tokens[token as Address].symbol,
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
              noEdit={isLoading}
              className="!text-normal !text-textLight"
            />
          </div>
        </div>
      </Modal>
    )
  );
}
