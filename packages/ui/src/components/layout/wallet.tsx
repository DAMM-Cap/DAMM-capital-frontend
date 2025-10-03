import { Button, ConnectedIcon, Modal } from "@/components";
import { useSession } from "@/context/session-context";
import { useModal } from "@/hooks/use-modal";
import { getShortAddress } from "@/shared/config/network";
import { LogInIcon } from "lucide-react";
import React from "react";

interface WalletProps {
  onClick?: () => void;
}

const Wallet: React.FC<WalletProps> = ({ onClick }) => {
  const {
    isOpen: openModal,
    open: setOpenModal,
    close: setCloseModal,
  } = useModal(false, { onClose: () => onClick?.() });

  const { evmAddress, isSignedIn, isConnecting, showMfaModal, logout, login } = useSession();

  if (isConnecting) {
    return (
      <Button onClick={() => {}} variant="tertiary" className="text-sm">
        <ConnectedIcon color="var(--color-invalid)" />
        Connecting...
      </Button>
    );
  }

  return (
    <>
      {isSignedIn ? (
        <Button
          onClick={() => {
            setOpenModal();
          }}
          variant="tertiary"
          className="text-sm"
        >
          <ConnectedIcon />
          {getShortAddress(evmAddress)}
        </Button>
      ) : (
        <Button onClick={login} className="text-sm">
          <LogInIcon size={16} />
          Log in
        </Button>
      )}

      <Modal
        open={openModal}
        onClose={() => {
          setCloseModal();
        }}
        title="Your Smart Account"
        actions={() => (
          <>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(evmAddress!);
                setCloseModal();
              }}
              variant="secondary"
              className="text-sm w-full"
            >
              Copy address
            </Button>
            <Button onClick={showMfaModal} variant="secondary" className="text-sm w-full">
              Configure MFA
            </Button>
            <Button
              onClick={() => {
                logout();
                setCloseModal();
              }}
              variant="primary"
              className="text-sm w-full"
              disabled={!isSignedIn}
            >
              Sign out
            </Button>
          </>
        )}
      >
        <div className="text-center text-lg mb-4">{evmAddress}</div>
      </Modal>
    </>
  );
};

export default Wallet;
