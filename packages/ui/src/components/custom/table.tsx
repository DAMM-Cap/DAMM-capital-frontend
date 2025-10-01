import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { TableContext } from "../context/table-context";
import { useIsMobile } from "../hooks/use-is-mobile";

export interface HeaderData {
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

  const isTableMobile = isMobile && tableHeaders.length > 2;
  const gridColsNumber = (tableHeaders.length + 1) * 2;
  const gridColsClassName = `grid-cols-${gridColsNumber}`;

  return (
    <div className={clsx("w-full mx-auto", className)}>
      {/* Desktop Header */}
      {!isTableMobile && (
        <div className={clsx("grid gap-2 items-center mb-4 px-4", gridColsClassName)}>
          {tableHeaders.map((item, index) => (
            <div key={index} className={clsx("w-full", index === 0 ? "col-span-4" : "col-span-2")}>
              <div
                className={clsx(
                  "font-montserrat font-normal text-xs leading-none text-neutral",
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
      <TableContext.Provider value={{ tableHeaders, isTableMobile, gridColsClassName }}>
        <div className="space-y-2">{children}</div>
      </TableContext.Provider>
    </div>
  );
};

export default Table;
