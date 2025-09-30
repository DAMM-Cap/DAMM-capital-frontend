import { Button, Modal } from "@/components";
import { getChainLogo, getShortAddress } from "@/shared/config/network";
import { Copy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Chain } from "viem";

interface ReceiveTokensDialogProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  chain: Chain;
}

export const ReceiveTokensDialog = ({
  isOpen,
  onClose,
  address: evmAddress,
  chain,
}: ReceiveTokensDialogProps) => {
  const shortAddress = getShortAddress(evmAddress);
  const chainLogo = getChainLogo(chain);

  return (
    <Modal
      title="Receive Tokens"
      open={isOpen}
      onClose={onClose}
      actions={() => (
        <>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(evmAddress);
              onClose();
            }}
            variant="secondary"
            className="text-sm w-full"
          >
            Copy address
          </Button>
          <Button onClick={onClose} variant="primary" className="w-full">
            Close
          </Button>
        </>
      )}
    >
      <div className="flex flex-col w-full items-center gap-12 justify-center pt-16 pb-8">
        <div className="relative">
          <QRCodeSVG value={evmAddress} size={200} level="L" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-[5px] border-white bg-white rounded-full shadow-md">
            <img className="w-14 h-14" src={chainLogo} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-3xl font-light">{shortAddress}</span>
            <span className="text-xs font-medium">Address</span>
          </div>
          <Copy
            className="w-8 h-8 cursor-pointer hover:text-gray-500"
            strokeWidth={2}
            onClick={() => {
              navigator.clipboard.writeText(evmAddress);
            }}
          />
        </div>
      </div>
    </Modal>
  );
};
