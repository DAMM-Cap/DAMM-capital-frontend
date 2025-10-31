import { Button, Input, Label, Modal } from "@/components";
import { getNetworkConfig } from "@/shared/config/network";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { isAddress } from "viem";

interface RescueTokenDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  pushRescueToken: (erc20Address: string) => void;
  isValidERC20Address: boolean;
}

export function RescueTokenDialog({
  isOpen,
  setIsOpen,
  pushRescueToken,
  isValidERC20Address,
}: RescueTokenDialogProps) {
  const chainName = getNetworkConfig().chain.name;

  const [erc20Address, setErc20Address] = useState("");
  const [invalidErc20Address, setInvalidErc20Address] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleErc20AddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErc20Address(e.target.value);
    setInvalidErc20Address(e.target.value.length > 0 && !isAddress(e.target.value));
  };

  const validateForm = () => {
    if (erc20Address.length === 0) {
      setInvalidErc20Address(true);
      return false;
    }
    return true;
  };

  const handleRescueToken = () => {
    if (!validateForm()) return;
    setIsLoading(true);
    pushRescueToken(erc20Address);
    handleReset();
    setIsLoading(false);
    // Closes in parent as it chains with the openSendRescueToken modal
  };

  const handleReset = () => {
    setErc20Address("");
    setInvalidErc20Address(false);
  };

  useEffect(() => {
    if (isOpen) {
      handleReset();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Modal
      title="Rescue Token"
      open={isOpen}
      onClose={() => setIsOpen(false)}
      blockClose={isLoading}
      actions={() => (
        <Button
          className={clsx(
            "w-full",
            !isValidERC20Address && "!text-textError hover:!bg-secondary hover:!border-secondary",
          )}
          onClick={handleRescueToken}
          variant={isValidERC20Address ? "primary" : "secondary"}
          isLoading={isLoading}
          disabled={invalidErc20Address}
        >
          {isValidERC20Address ? "Rescue Token" : "Invalid ERC-20 contract address"}
        </Button>
      )}
    >
      <div className="flex flex-col w-full items-left gap-2">
        <Label
          label={`Insert the ERC-20 contract address of the assets you want to rescue on ${chainName}.`}
          className="!text-normal !text-textLight"
        />

        <div className="flex flex-col w-full items-left gap-4 mt-8 mb-4">
          <Input
            label="ERC-20 contract address"
            type="text"
            value={erc20Address}
            validation={invalidErc20Address ? "invalid" : undefined}
            validationMessage="Invalid ERC-20 contract address"
            onChange={handleErc20AddressChange}
            noEdit={isLoading}
            className="!text-normal !text-textLight -mb-2"
          />
        </div>
      </div>
    </Modal>
  );
}
