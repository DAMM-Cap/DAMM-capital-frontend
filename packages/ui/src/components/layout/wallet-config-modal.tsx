import { Button, Label, Modal } from "@/components";
import ConfigIcon from "@/components/icons/config-icon";
import { useSession } from "@/context/session-context";
import { getShortAddress } from "@/shared/config/network";
import { useNavigate } from "@tanstack/react-router";
import { CopyIcon, LogOutIcon } from "lucide-react";
import { useIsMobile } from "../hooks/use-is-mobile";

export default function WalletConfigModal({
  openModal,
  setCloseModal,
}: {
  openModal: boolean;
  setCloseModal: () => void;
}) {
  const { evmAddress, isSignedIn, showMfaModal, logout } = useSession();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const shortAddress = getShortAddress(evmAddress);

  return (
    <Modal
      open={openModal}
      onClose={() => {
        setCloseModal();
      }}
      title="My Smart Account"
      actions={() => (
        <div className="flex flex-col gap-2 w-full">
          <Button
            onClick={() => {
              navigator.clipboard.writeText(evmAddress!);
            }}
            variant="tertiary"
            className="text-sm w-full"
            disabled={true}
          >
            <span className="text-textLight">{isMobile ? shortAddress : evmAddress}</span>
          </Button>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(evmAddress!);
            }}
            variant="tertiary"
            className="text-sm w-full mb-8"
          >
            <CopyIcon size={16} />
            Copy address
          </Button>
          <Button onClick={showMfaModal} variant="primary" className="text-sm w-full">
            <ConfigIcon className="w-4 h-4 text-textLight" />
            Manage MFA
          </Button>
          <Button
            onClick={() => {
              logout();
              navigate({ to: "/funds" });
              setCloseModal();
            }}
            variant="secondary"
            className="text-sm w-full"
            disabled={!isSignedIn}
          >
            <LogOutIcon size={16} />
            Sign out
          </Button>
        </div>
      )}
    >
      <div className="flex flex-col w-full items-left gap-2 mb-12">
        <Label label="Manage your session and security" className="!text-normal !text-textLight" />
      </div>
    </Modal>
  );
}
