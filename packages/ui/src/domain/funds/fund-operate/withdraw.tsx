import { Button, DammStableIcon } from "@/components";
import { getTokenLogo } from "@/components/token-icons";
import { TokenType, Tokens } from "@/domain/types/token";
import { useModal } from "@/hooks/use-modal";
import { useSelector } from "@/hooks/use-selector";
import { useWithdraw } from "@/services/lagoon/use-withdraw";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { WithdrawModal } from "./components";
import { useFundOperateData } from "./hooks/use-fund-operate-data";

interface WithdrawProps {
  vaultId: string;
  handleLoading: (isLoading: boolean) => void;
  className?: string;
  disabled?: boolean;
  isLoading: boolean;
}

export default function Withdraw({
  vaultId,
  handleLoading,
  className,
  disabled,
  isLoading,
}: WithdrawProps) {
  const { useWithdrawData, useDepositData, isLoading: vaultLoading } = useFundOperateData(vaultId);
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [isInsufficientBalance, setIsInsufficientBalance] = useState(false);
  const [invalidAmount, setInvalidAmount] = useState(false);
  const {
    position,
    positionUSDRaw,
    conversionValue,
    vault_address,
    token_symbol,
    token_address,
    token_decimals,
    vault_symbol,
    vault_decimals,
    positionUSD,
    getConvertedValue,
    isLoading: isWithdrawDataLoading,
  } = useWithdrawData();

  const {
    conversionValue: inversedConversionValue,
    getConvertedValue: getInversedConvertedValue,
    isLoading: isDepositDataLoading,
  } = useDepositData();

  const [tokens, setTokens] = useState<Tokens>({});
  
  useEffect(() => {
    if (!isWithdrawDataLoading && !isDepositDataLoading) {
      const tokens: Tokens = {};
      tokens[vault_address] = {
        iconNode: <DammStableIcon />,
        name: vault_symbol,
        symbol: vault_symbol,
        balance: position,
        conversionValue: conversionValue,
        getConvertedValue: getConvertedValue,
        metadata: {
          address: vault_address,
          decimals: vault_decimals,
        },
      };
      tokens[token_address] = {
        iconNode: <img
          src={getTokenLogo(token_symbol)}
          alt={token_symbol}
          className="w-5 h-5 object-cover rounded-full"
        />,
        name: token_symbol,
        symbol: token_symbol,
        balance: positionUSDRaw,
        conversionValue: inversedConversionValue,
        getConvertedValue: getInversedConvertedValue,
        metadata: {
          address: token_address,
          decimals: token_decimals,
        },
      };
      setTokens(tokens);
    }
  }, [isWithdrawDataLoading, isDepositDataLoading, position, positionUSDRaw, vault_address, vault_symbol, vault_decimals, token_address, token_symbol, token_decimals, conversionValue, inversedConversionValue]);

  const handleReset = () => {
    setAmount("");
    setConvertedAmount("");
    setIsInsufficientBalance(false);
    setInvalidAmount(false);
  };

  const {
    selectedRow,
    getNextRow,
    reset: resetSelector,
    change: changeTokenSelection,
  } = useSelector<TokenType>(tokens, 0, {
    onReset: handleReset,
    onChange: handleReset
  });

  const {
    isOpen: openModalWithdraw,
    open: setOpenModalWithdraw,
    close: setCloseModalWithdraw,
  } = useModal(false, { onOpen: resetSelector, onClose: () => handleLoading(false) });

  const { submitRequestWithdraw } = useWithdraw();

  const validateForm = () => {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || amount.length === 0) {
      setInvalidAmount(true);
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!selectedRow || !selectedRow.getConvertedValue) return;
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
      setInvalidAmount(true);
      setIsInsufficientBalance(false);
      setConvertedAmount("");
    } else {
      setInvalidAmount(false);
      const isInsufficientBalance = numericAmount > selectedRow.balance;
      setIsInsufficientBalance(isInsufficientBalance);
      setConvertedAmount(selectedRow.getConvertedValue(numericAmount).toString());
    }
  }, [amount]);

  const handleWithdraw = async () => {
    if (!validateForm()) return;
    handleLoading(true);
    let amountToWithdraw = amount;
    if (selectedRow.metadata.address === token_address) {
      amountToWithdraw = convertedAmount;
    }

    // Execute transaction
    const tx = await submitRequestWithdraw(vault_address, vault_decimals!, amountToWithdraw);

    // Wait for confirmation
    await tx.wait();

    setCloseModalWithdraw();
  };

  // Don't render if vault is not found or still loading
  if (vaultLoading) {
    return null;
  }

  return (
    <div className={className}>
      <Button
        onClick={() => {
          setOpenModalWithdraw();
        }}
        variant="secondary"
        className={clsx("w-full", className)}
        disabled={disabled || selectedRow?.balance === 0}
        isLoading={isLoading}
      >
        Withdraw
      </Button>

      <WithdrawModal
        open={openModalWithdraw}
        onClose={() => setCloseModalWithdraw()}
        amount={amount}
        convertedAmount={Number(convertedAmount)}
        onAmountChange={(e) => setAmount(e.target.value)}
        onMaxClick={() => setAmount(selectedRow?.balance?.toString() ?? "0")}
        max={selectedRow?.balance ?? 0}
        position={position}
        conversionValue={selectedRow?.conversionValue ?? 0}
        positionConverted={positionUSD.toString()}
        onWithdraw={() => handleWithdraw()}
        isLoading={isLoading}
        isInsufficientShares={isInsufficientBalance}
        invalidAmount={invalidAmount}
        selectedTokenSymbol={selectedRow?.symbol}
        secondaryTokenSymbol={getNextRow()?.symbol}
        selectedTokenIcon={selectedRow?.iconNode ?? <DammStableIcon />}
        vaultIcon={<DammStableIcon />}
        vaultSymbol={vault_symbol}
        selector={{
          onOptionSelected: (e) => changeTokenSelection(e.target.value),
          options: Object.keys(tokens).map((token) => ({
            label: tokens[token].symbol,
            value: token,
          })),
        }}
      />
    </div>
  );
}
