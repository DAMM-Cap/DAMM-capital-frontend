import { LogInIcon } from "lucide-react";
import React, { useState } from "react";
import { Button, Modal } from "..";
import { useAuth } from "../hooks/use-auth";
import { useIsMobile } from "../hooks/use-is-mobile";
import ConnectedIcon from "../icons/ConnectedIcon";
import BrandHeader from "./BrandHeader";
import NavBar from "./NavBar";

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const { isSignedIn, evmAddress, signOut } = useAuth();
  const [openModal, setOpenModal] = useState(false);

  return (
    <header className="w-full bg-textDark py-3 px-2">
      <div className="flex flex-row w-full max-w-6xl mx-auto justify-between items-center text-sm">
        <div className="flex items-center gap-8">
          <BrandHeader />
          {!isMobile && <NavBar />}
        </div>
        <div className="flex items-center">
          {isMobile ? (
            <NavBar />
          ) : isSignedIn ? (
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
            <Button onClick={() => {}} className="text-sm px-4">
              <LogInIcon size={14} className="w-4 h-4" />
              <span className="inline">Log In</span>
            </Button>
          )}
        </div>
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
          </>
        )}
      >
        <div className="text-center mb-4">{evmAddress}</div>
      </Modal>
    </header>
  );
};

export default Header;
