import { Button, ConnectedIcon, Modal } from "@/components";
import { useSession } from "@/context/session-context";
import React, { useState } from "react";

const Wallet: React.FC = () => {
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
      <div>
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
            Sign in
          </Button>
        )}
      </div>

      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        title="Your Smart Account"
        className="w-[480px]"
        actions={() => (
          <>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(evmAddress!);
                setOpenModal(false);
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
