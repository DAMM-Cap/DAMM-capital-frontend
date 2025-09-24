import { LogInIcon } from "lucide-react";
import React from "react";
import Button from "../core/Button";
import { useIsMobile } from "../hooks/use-is-mobile";
import BrandHeader from "./BrandHeader";
import NavBar from "./NavBar";

const Header: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <header className="w-full bg-textDark py-3 sm:py-4">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-4 sm:gap-8 lg:gap-20">
              <BrandHeader />
              {!isMobile && <NavBar />}
            </div>
            <div className="flex items-center">
              {isMobile ? (
                <NavBar />
              ) : (
                <Button onClick={() => {}} className="text-xs sm:text-sm px-2 sm:px-4">
                  <LogInIcon size={14} className="sm:w-4 sm:h-4" />
                  <span className="xs:inline">Log In</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
