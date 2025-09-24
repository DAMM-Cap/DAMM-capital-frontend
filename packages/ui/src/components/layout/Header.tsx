import { LogInIcon } from "lucide-react";
import React from "react";
import Button from "../core/Button";
import { useIsMobile } from "../hooks/use-is-mobile";
import BrandHeader from "./BrandHeader";
import NavBar from "./NavBar";

const Header: React.FC = () => {
  const isMobile = useIsMobile();

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
          ) : (
            <Button onClick={() => {}} className="text-sm px-4">
              <LogInIcon size={14} className="w-4 h-4" />
              <span className="inline">Log In</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
