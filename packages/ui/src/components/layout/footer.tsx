import clsx from "clsx";
import React from "react";
import { useIsMobile } from "../hooks/use-is-mobile";
import lagoonIcon from "/lagoon.svg";

const Footer: React.FC = () => {
  const isMobile = useIsMobile();
  return (
    <footer className="w-full bg-textDark py-4">
      <div className="w-full px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center text-xs text-textLight">
            <div>© 2026 DAMM Labs. All rights reserved.</div>
            <div
              className={clsx("flex items-center text-xs text-textLight", isMobile && "flex-col")}
            >
              <div>Powered by </div>
              <img
                src={lagoonIcon}
                alt={lagoonIcon}
                className={clsx(isMobile ? "h-3 w-auto mt-0.5" : "h-4 w-auto ml-2")}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
