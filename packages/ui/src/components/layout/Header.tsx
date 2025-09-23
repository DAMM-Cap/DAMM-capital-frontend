import { LogInIcon } from "lucide-react";
import React from "react";
import Button from "../core/Button";
import Label from "../core/Label";
import TitleLabel from "../custom/TitleLabel";
import NavBar from "./NavBar";

const Header: React.FC = () => {
  return (
    <header className="w-full bg-textDark py-3 sm:py-4">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-4 sm:gap-8 lg:gap-20">
              <div className="flex items-center gap-0">
                <img
                  src="/Damm_Capital_Isotipo_Fondo Oscuro.svg"
                  alt="Damm Capital"
                  className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 self-center"
                />
                <div className="flex flex-col gap-0 w-16 sm:w-20 lg:w-24 items-center justify-center -mt-3 sm:-mt-4 -ml-1 sm:-ml-2">
                  <TitleLabel
                    title="DAMM"
                    className="text-textLight font-bold mb-0"
                    titleClassName="!text-sm sm:!text-lg text-textLight font-bold text-body font-black -mb-2 sm:-mb-2 -ml-1 lg:ml-1 text-center leading-none"
                  />
                  <Label
                    label="CAPITAL"
                    className="text-textLight font-bold text-capital lg:text-xs -mt-1 sm:-mt-3 lg:-mt-4 lg:ml-1 -ml-0.5 sm:ml-2 [&_label]:!text-center [&_label]:!tracking-[0.24em] [&_label]:!leading-none"
                  />
                </div>
              </div>
              <div className="hidden sm:block">
                <NavBar />
              </div>
            </div>
            <div className="flex items-center">
              <div className="sm:hidden">
                <NavBar />
              </div>
              <div className="hidden sm:block">
                <Button onClick={() => {}} className="text-xs sm:text-sm px-2 sm:px-4">
                  <LogInIcon size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Log In</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
