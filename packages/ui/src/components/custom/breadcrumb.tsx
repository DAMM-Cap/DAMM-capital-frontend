import { useNavigate } from "@tanstack/react-router";
import clsx from "clsx";
import { ArrowLeftIcon } from "lucide-react";

interface BreadcrumbProps {
  vaultName: string;
  className?: string;
}

export default function Breadcrumb({ vaultName, className }: BreadcrumbProps) {
  const navigate = useNavigate();
  return (
    <div className={clsx("breadcrumbs text-sm", className)}>
      <ul>
        <li>
          <a
            className="text-neutral hover:text-textLight"
            onClick={() => navigate({ to: "/funds" })}
          >
            <ArrowLeftIcon className="w-3 h-3" />
            Funds
          </a>
        </li>
        <li>
          <a className="text-textLight hover:text-textLight">{vaultName}</a>
        </li>
      </ul>
    </div>
  );
}
