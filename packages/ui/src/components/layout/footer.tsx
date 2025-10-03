import React from "react";
import lagoonIcon from "/lagoon.svg";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-textDark py-4">
      <div className="w-full px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center text-xs text-textLight">
            <div>© 2025 DAMM Labs. All rights reserved.</div>
            <div className="flex text-xs text-textLight">
              <div>Powered by </div>
              <img src={lagoonIcon} alt={lagoonIcon} className="h-4 w-auto ml-2" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
