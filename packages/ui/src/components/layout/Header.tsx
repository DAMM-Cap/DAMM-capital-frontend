import { LogInIcon } from "lucide-react";
import React from "react";
import Button from "../core/Button";
import Label from "../core/Label";
import TitleComponent from "../custom/TitleComponent";
import NavBar from "./NavBar";

const Header: React.FC = () => {
  return (
    <header className="w-full bg-textDark py-4">
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
                    className="text-textLight font-bold text-lg [&_h4]:!text-[20px] [&_h4]:!font-black mb-0 [&_h4]:!text-center [&_h4]:!leading-none"
                  />
                  <Label
                    label="CAPITAL"
                    className="text-textLight font-bold text-lg [&_label]:!text-[12px] -mt-4 [&_label]:!text-center [&_label]:!tracking-[0.24em] [&_label]:!leading-none"
                  />
                </div>
              </div>
              <NavBar />
            </div>
            <div>
              <Button onClick={() => {}} className="text-sm">
                <LogInIcon size={16} />
                Log In
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
