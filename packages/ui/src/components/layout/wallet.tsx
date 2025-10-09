import { Button, ConnectedIcon } from "@/components";
import { useSession } from "@/context/session-context";
import { useModal } from "@/hooks/use-modal";
import { getShortAddress } from "@/shared/config/network";
import { LogInIcon } from "lucide-react";
import React from "react";
import AcknowledgeTermsModal from "./acknowledge-terms-modal";
import WalletConfigModal from "./wallet-config-modal";

interface WalletProps {
  onClick?: () => void;
}

const Wallet: React.FC<WalletProps> = ({ onClick }) => {
  const {
    isOpen: openModal,
    open: setOpenModal,
    close: setCloseModal,
  } = useModal(false, { onClose: () => onClick?.() });

  const { evmAddress, isSignedIn, isConnecting, login } = useSession();
  const {
    isOpen: openModalTerms,
    open: setOpenModalTerms,
    toggle: toggleModalTerms,
  } = useModal(false);

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
        <Button onClick={setOpenModalTerms} className="text-sm">
          <LogInIcon size={16} />
          Log in
        </Button>
      )}

      <AcknowledgeTermsModal
        openModalTerms={openModalTerms}
        setOpenModalTerms={toggleModalTerms}
        handleAccept={login}
      />

      <WalletConfigModal openModal={openModal} setCloseModal={setCloseModal} />
    </>
  );
};

export default Wallet;
