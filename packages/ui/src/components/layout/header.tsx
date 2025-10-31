import React from "react";

import { useIsMobile } from "../hooks/use-is-mobile";
import BrandHeader from "./brand-header";
import NavBar from "./nav-bar";
import Wallet from "./wallet";

const Header: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <header className="w-full bg-textDark py-3 px-2">
      <div className="flex flex-row w-full max-w-6xl mx-auto justify-between items-center text-sm">
        <BrandHeader />
        {!isMobile && (
          <div className="flex-1">
            <NavBar />
          </div>
        )}
        <div className="flex items-center">{isMobile ? <NavBar /> : <Wallet />}</div>
      </div>
    </header>
  );
};

export default Header;
