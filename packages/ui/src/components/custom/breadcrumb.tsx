import clsx from "clsx";
import { ArrowLeftIcon } from "lucide-react";

interface BreadcrumbProps {
  vaultName: string;
  className?: string;
}

export default function Breadcrumb({ vaultName, className }: BreadcrumbProps) {
  return (
    <div className={clsx("breadcrumbs text-sm", className)}>
      <ul>
        <li>
          <a href="/funds" className="text-neutral hover:text-textLight">
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
