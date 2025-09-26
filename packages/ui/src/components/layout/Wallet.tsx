import { Button, ConnectedIcon, Modal } from "@/components";
import { useSession } from "@/context/session-context";
import { LogInIcon } from "lucide-react";
import React, { useState } from "react";

interface WalletProps {
  onClick?: () => void;
}

const Wallet: React.FC<WalletProps> = ({ onClick }) => {
  const [openModal, setOpenModal] = useState(false);
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
            setOpenModal(true);
          }}
          variant="tertiary"
          className="text-sm"
        >
          <ConnectedIcon />
          {evmAddress?.slice(0, 6)}...{evmAddress?.slice(-4)}
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
          setOpenModal(false);
          onClick?.();
        }}
        title="Your Smart Account"
        actions={() => (
          <>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(evmAddress!);
                setOpenModal(false);
                onClick?.();
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
                setOpenModal(false);
                onClick?.();
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
        <div className="text-center mb-4">{evmAddress}</div>
      </Modal>
    </>
  );
};

export default Wallet;
