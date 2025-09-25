import React from "react";

import { useIsMobile } from "../hooks/use-is-mobile";
import BrandHeader from "./BrandHeader";
import NavBar from "./NavBar";
import Wallet from "./Wallet";

const Header: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <header className="w-full bg-textDark py-3 px-2">
      <div className="flex flex-row w-full max-w-6xl mx-auto justify-between items-center text-sm">
        <div className="flex items-center gap-8">
          <BrandHeader />
          {!isMobile && <NavBar />}
        </div>
        <div className="flex items-center">{isMobile ? <NavBar /> : <Wallet />}</div>
      </div>
    </header>
  );
};

export default Header;
