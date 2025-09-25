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
import Modal from "../core/Modal";
import ConnectedIcon from "../icons/ConnectedIcon";

const WalletService: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [evmAddress, setEvmAddress] = useState<string>("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { wallets } = useWallets();
  const { wallet, network } = useActiveWallet();

  const { showMfaEnrollmentModal } = useMfaEnrollment();
  const { logout } = useLogout();

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
      } else {
        setIsSignedIn(false);
        setEvmAddress("");
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
      <Button onClick={() => {}} variant="tertiary" className="text-sm">
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
            variant="tertiary"
            className="text-sm"
          >
            <ConnectedIcon />
            {evmAddress?.slice(0, 6)}...{evmAddress?.slice(-4)}
          </Button>
        ) : (
          <Button
            onClick={() => {
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
            <Button onClick={showMfaEnrollmentModal} variant="secondary" className="text-sm w-full">
              MFA
            </Button>
            <Button
              onClick={() => {
                logout();
                setOpenModal(false);
              }}
              variant="primary"
              className="text-sm w-full"
              disabled={!ready || (ready && !authenticated)}
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

export default WalletService;
