import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-textDark py-4">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center text-xs text-textLight">
            <div>© 2025 DAMM Labs. All rights reserved.</div>
            <div>Powered by Lagoon</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
