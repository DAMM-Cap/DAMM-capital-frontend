import { Link } from "@tanstack/react-router";
import { LogInIcon, MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";
import Button from "../core/Button";

const items = [
  { to: "/funds", label: "Funds" },
  { to: "/deposit", label: "Deposit" },
  { to: "/portfolio", label: "Portfolio" },
];

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative">
      {/* Desktop Navigation */}
      <nav aria-label="Main" className="hidden sm:flex items-center gap-6 lg:gap-8">
        {items.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            className="transition-colors hover:text-linkHover text-sm lg:text-base"
            activeOptions={{ exact: false }}
            activeProps={{
              className: "!text-primary hover:!text-linkHover",
              "aria-current": "page",
            }}
            inactiveProps={{ className: "text-textLight" }}
            preload="intent"
          >
            {it.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Menu Button */}
      <div className="sm:hidden">
        <Button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <XIcon size={16} /> : <MenuIcon size={16} />}
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full right-0 bg-textDark border border-secondary rounded-lg shadow-lg z-50 sm:hidden min-w-[200px]">
          <nav className="flex flex-col p-4 space-y-2">
            {items.map((it) => (
              <Link
                key={it.to}
                to={it.to}
                className="transition-colors hover:text-linkHover py-2 px-4 rounded-lg hover:bg-disabled"
                activeOptions={{ exact: false }}
                activeProps={{
                  className: "!text-primary hover:!text-linkHover bg-disabled",
                  "aria-current": "page",
                }}
                inactiveProps={{ className: "text-textLight" }}
                preload="intent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {it.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-secondary">
              <Button onClick={() => {}} className="w-full">
                <LogInIcon size={16} />
                Log In
              </Button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
