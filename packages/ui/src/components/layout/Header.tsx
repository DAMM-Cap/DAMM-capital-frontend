import {
  useEvmAddress,
  useIsSignedIn,
  useSignInWithEmail,
  useSignOut,
  useVerifyEmailOTP,
} from "@coinbase/cdp-hooks";
import { AuthButton } from "@coinbase/cdp-react/components/AuthButton";
import { Link, useLocation } from "@tanstack/react-router";
import React, { useState } from "react";
import Button from "../core/Button";
import Label from "../core/Label";
import Modal, { ModalActionButtons, ModalContents } from "../core/Modal";
import TitleComponent from "../custom/TitleComponent";
import ConnectedIcon from "../icons/ConnectedIcon";

const Header: React.FC = () => {
  const location = useLocation();
  const { evmAddress } = useEvmAddress();
  const { isSignedIn } = useIsSignedIn();
  const [openModal, setOpenModal] = useState(false);
  const { signOut } = useSignOut();
  /* const { signInWithEmail } = useSignInWithEmail();
  const { verifyEmailOTP } = useVerifyEmailOTP(); */

  /* const handleSignInWithEmail = async () => {
    const { email, otp } = await signInWithEmail();
    await verifyEmailOTP(email, otp);
  }; */

  const getLinkClassName = (path: string) => {
    const isActive = location.pathname === path;
    return `transition-colors ${isActive ? "text-[#A3E635] hover:text-[#A3E635]" : "text-[#F7FEE7] hover:text-[#A3E635]"}`;
  };

  return (
    <header className="w-full bg-[#09090B] py-4">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-20">
              <div className="flex items-center gap-0">
                <img
                  src="/Damm_Capital_Isotipo_Fondo Oscuro.svg"
                  alt="Damm Capital"
                  className="w-8 h-8 flex-shrink-0 self-center"
                />
                <div className="flex flex-col gap-0 w-24 items-center justify-center -mt-3 -ml-2">
                  <TitleComponent
                    title="DAMM"
                    className="text-[#F7FEE7] font-bold text-lg [&_h4]:!text-[20px] [&_h4]:!font-black mb-0 [&_h4]:!text-center [&_h4]:!leading-none"
                  />
                  <Label
                    label="CAPITAL"
                    className="text-[#F7FEE7] font-bold text-lg [&_label]:!text-[12px] -mt-4 [&_label]:!text-center [&_label]:!tracking-[0.24em] [&_label]:!leading-none"
                  />
                </div>
              </div>
              <nav className="flex items-center gap-8">
                <Link to="/funds" className={getLinkClassName("/funds")}>
                  Funds
                </Link>
                <Link to="/portfolio" className={getLinkClassName("/portfolio")}>
                  Portfolio
                </Link>
              </nav>
            </div>
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
                <AuthButton className="h-8 w-36 rounded-2xl -mt-4 " />
              )}
            </div>
          </div>
        </div>
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
          <Button
            onClick={() => {
              signOut();
              setOpenModal(false);
            }}
            variant="primary"
            className="text-sm"
          >
            Sign out
          </Button>
          {/* <AuthButton className="!w-[240px] rounded-2xl" /> */}
        </ModalActionButtons>
      </Modal>
    </header>
  );
};

export default Header;
