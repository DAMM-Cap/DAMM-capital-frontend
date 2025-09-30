import clsx from "clsx";
import React from "react";
import { useIsMobile } from "../hooks/use-is-mobile";

interface HeaderData {
  label: string;
  className?: string;
}

interface TableProps {
  tableHeaders: HeaderData[];

  className?: string;
  children?: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ tableHeaders, className = "", children }) => {
  const isMobile = useIsMobile();

  const clamped = Math.min(Math.max(tableHeaders.length, 2), 5);

  return (
    <div className={clsx("w-full mx-auto", className)}>
      {/* Desktop Header */}
      {!isMobile && (
        <div className={clsx("grid gap-2 items-center mb-4 px-4", `grid-cols-${clamped}`)}>
          {tableHeaders.map((item, index) => (
            <div key={index} className="col-span-1">
              <div
                className={clsx(
                  "font-montserrat font-normal text-tiny leading-none text-neutral",
                  // Use explicit className if provided, otherwise use default alignment
                  item.className ||
                    (index === 0
                      ? "text-left"
                      : index === tableHeaders.length - 1
                        ? "text-right"
                        : "text-center"),
                )}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rows */}
      <div className="space-y-2">{children}</div>
    </div>
  );
};

export default Table;
