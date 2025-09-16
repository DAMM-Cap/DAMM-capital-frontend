import { Link } from "@tanstack/react-router";

const items = [
  { to: "/funds", label: "Funds" },
  { to: "/deposit", label: "Deposit" },
  { to: "/portfolio", label: "Portfolio" },
];

export default function NavBar() {
  return (
    <nav aria-label="Main" className="flex items-center gap-8">
      {items.map((it) => (
        <Link
          key={it.to}
          to={it.to}
          className="transition-colors hover:text-primary"
          activeOptions={{ exact: false }}
          activeProps={{
            className: "!text-primary hover:!text-primary",
            "aria-current": "page",
          }}
          inactiveProps={{ className: "text-textLight" }}
          preload="intent"
        >
          {it.label}
        </Link>
      ))}
    </nav>
  );
}
