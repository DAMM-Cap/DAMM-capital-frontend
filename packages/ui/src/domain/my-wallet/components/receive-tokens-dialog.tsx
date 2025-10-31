import { Button, Label, Modal } from "@/components";
import { useIsMobile } from "@/components/hooks/use-is-mobile";
import { getChainLogo, getShortAddress, NetworkConfig } from "@/shared/config/network";
import clsx from "clsx";
import { CheckIcon, CopyIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

interface ReceiveTokensDialogProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  network: NetworkConfig;
}

export const ReceiveTokensDialog = ({
  isOpen,
  onClose,
  address: evmAddress,
  network,
}: ReceiveTokensDialogProps) => {
  const chainLogo = getChainLogo(network.chain);
  const chainName = network.chain.name;
  const isMobile = useIsMobile();
  const shortAddress = getShortAddress(evmAddress);
  const [isAddressCopied, setIsAddressCopied] = useState(false);
  
  const handleAddressCopied = () => {
    setIsAddressCopied(true);
    setTimeout(() => {
      setIsAddressCopied(false);
    }, 2000);
  };

  return (
    <Modal
      title="Receive Tokens"
      open={isOpen}
      onClose={onClose}
      actions={() => (
        <div className="flex flex-col gap-2 w-full">
        <Button
            variant="tertiary"
            className="text-sm w-full"
            disabled={true}
          >
            <span className="text-textLight">{isMobile ? shortAddress : evmAddress}</span>
          </Button>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(evmAddress);
              handleAddressCopied();
            }}
            variant="secondary"
            className={clsx("text-sm w-full", isAddressCopied && "!text-textSuccess hover:!bg-secondary hover:!border-secondary")}
          >
            {isAddressCopied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
            {isAddressCopied ? "Address copied to clipboard" : "Copy address"}
          </Button>
        </div>
      )}
    >
      <div className="flex flex-col w-full items-center gap-12 justify-center pt-16 pb-8">
        <div className="flex w-full items-left gap-2 -mt-16">
          <Label
            label={`Only send assets on ${chainName}. Deposits from other networks won't be credited.`}
            className="!text-normal !text-textLight"
          />
        </div>
        <div className="relative">
          <QRCodeSVG value={evmAddress} size={200} level="L" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-[5px] border-white bg-white rounded-full shadow-md">
            <img className="w-14 h-14" src={chainLogo} />
          </div>
        </div>
      </div>
    </Modal>
  );
};
