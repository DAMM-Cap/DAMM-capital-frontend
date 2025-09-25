import {
  useActiveWallet,
  useConnectOrCreateWallet,
  useLogout,
  useMfaEnrollment,
  usePrivy,
  useWallets,
} from "@privy-io/react-auth";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Button from "../core/Button";
import Modal, { ModalActionButtons, ModalContents } from "../core/Modal";
import ConnectedIcon from "../icons/ConnectedIcon";

const WalletService: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [evmAddress, setEvmAddress] = useState<string>("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [accountType, setAccountType] = useState<"wagmi" | "embedded" | "injected" | "unknown">(
    "unknown",
  );
  const { wallets } = useWallets();
  const { wallet, network } = useActiveWallet();

  const { showMfaEnrollmentModal } = useMfaEnrollment();
  const { logout } = useLogout();

  /* const { signOut } = useSignOut(); */

  const { ready, authenticated, user } = usePrivy();

  const { connectOrCreateWallet } = useConnectOrCreateWallet();
  const { address } = useAccount();

  const handleConnectOrCreateWallet = async () => {
    connectOrCreateWallet();
  };

  useEffect(() => {
    if (ready) {
      if (user && authenticated) {
        const wallet = user?.smartWallet?.address || user!.wallet!.address;
        setEvmAddress(wallet);
        setIsSignedIn(true);
        if (user!.wallet!.connectorType === "embedded") {
          setAccountType("embedded");
        } else if (user!.wallet!.connectorType === "injected") {
          setAccountType("injected");
        } else {
          setAccountType("unknown");
        }
      } else if (!user && address) {
        setEvmAddress(address);
        setIsSignedIn(true);
        setAccountType("wagmi");
      } else {
        setIsSignedIn(false);
        setEvmAddress("");
        setAccountType("unknown");
      }
      console.log("ready", ready);
      console.log("wallets", wallets);
      console.log("address", address);
      console.log("activeWallet", wallet);
      console.log("network", network);
      console.log("user", user);
      console.log("authenticated", authenticated);
    }
  }, [ready, user, authenticated, address]);

  if (!ready) {
    return (
      <Button onClick={() => {}} variant="secondary" className="text-sm">
        <ConnectedIcon color="#EF4444" />
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
            variant="secondary"
            className="text-sm"
          >
            <ConnectedIcon />
            {evmAddress?.slice(0, 6)}...{evmAddress?.slice(-4)}
          </Button>
        ) : (
          /* <AuthButton className="h-8 w-36 rounded-2xl -mt-4 " /> */
          <Button
            onClick={() => {
              //setOpenModal(true);
              handleConnectOrCreateWallet();
            }}
            className="text-sm"
          >
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
      >
        <ModalContents>
          <div className="text-center mb-4">{evmAddress}</div>
        </ModalContents>
        <ModalActionButtons>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(evmAddress!);
              setOpenModal(false);
            }}
            variant="secondary"
            className="text-sm"
          >
            Copy address
          </Button>
          <Button onClick={showMfaEnrollmentModal}>MFA</Button>
          <Button
            onClick={() => {
              //signOut();
              logout();
              setOpenModal(false);
            }}
            variant="primary"
            className="text-sm"
            disabled={!ready || (ready && !authenticated)}
          >
            Sign out
          </Button>
          {/* <AuthButton className="!w-[240px] rounded-2xl" /> */}
        </ModalActionButtons>
      </Modal>
    </>
  );
};

export default WalletService;
