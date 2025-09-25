import { Link } from "@tanstack/react-router";
import { LogInIcon, MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";
import Button from "../core/Button";
import { useIsMobile } from "../hooks/use-is-mobile";

const items = [
  { to: "/funds", label: "Funds" },
  { to: "/fund-operate", label: "Fund Operate" },
  { to: "/portfolio", label: "Portfolio" },
];

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="relative">
      {/* Desktop Navigation */}
      {!isMobile && (
        <nav aria-label="Main" className="flex items-center gap-8">
          {items.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              className="transition-colors hover:text-linkHover text-base"
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
      )}

      {/* Mobile Menu Button */}
      {isMobile && (
        <Button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <XIcon size={16} /> : <MenuIcon size={16} />}
        </Button>
      )}

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full right-0 bg-textDark border border-secondary rounded-lg shadow-lg z-50 min-w-[200px]">
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
