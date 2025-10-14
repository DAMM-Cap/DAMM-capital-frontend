import { CircledExclamationIcon, Tooltip } from "@/components";
import clsx from "clsx";
import React from "react";
import { useIsMobile } from "../hooks/use-is-mobile";
import Row, { RowProps } from "./row";
export interface HeaderData {
  label: string;
  tooltip?: string;
  className?: string;
}

interface TableProps {
  tableHeaders: HeaderData[];
  className?: string;
  initialCol2X?: boolean;
  noColor?: boolean;
  rows?: Pick<RowProps, "rowFields" | "className" | "onClick" | "initialCol2X" | "noColor">[];
  isLoading?: boolean;
}

const Table: React.FC<TableProps> = ({
  tableHeaders,
  className = "",
  initialCol2X = true,
  noColor = false,
  rows,
  isLoading,
}) => {
  const isMobile = useIsMobile();

  const isTableMobile = isMobile && tableHeaders.length > 2;
  const gridColsNumber = initialCol2X ? (tableHeaders.length + 1) * 2 : tableHeaders.length * 2;
  const gridColsClassName = `grid-cols-${gridColsNumber}`;

  return (
    <div className={clsx("w-full mx-auto", className)}>
      {/* Desktop Header */}
      {!isTableMobile && (
        <div
          className={clsx(
            "grid gap-2 items-center px-4",
            { "mb-4": !noColor, "-mb-2": noColor },
            gridColsClassName,
          )}
        >
          {tableHeaders.map((item, index) => (
            <div
              key={index}
              className={clsx("w-full", index === 0 && initialCol2X ? "col-span-4" : "col-span-2")}
            >
              <div
                className={clsx(
                  "font-montserrat font-normal  leading-none text-neutral",
                  { "text-xs": !noColor, "text-sm": noColor },
                  // Use explicit className if provided, otherwise use default alignment
                  item.className ||
                    (index === 0 && initialCol2X
                      ? "text-left"
                      : index === tableHeaders.length - 1
                        ? "text-right"
                        : "text-center"),
                )}
              >
                {item.tooltip && (
                  <Tooltip content={item.tooltip}>
                    {item.label} <CircledExclamationIcon className="ml-2 -mt-0.5" size={16} />
                  </Tooltip>
                )}
                {!item.tooltip && item.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rows */}
      <div className="space-y-2">
        {rows?.map((row, index) => (
          <Row
            key={index}
            rowFields={row.rowFields}
            isLoading={isLoading}
            tableHeaders={tableHeaders}
            isTableMobile={isTableMobile}
            gridColsClassName={gridColsClassName}
            initialCol2X={initialCol2X}
            noColor={noColor}
            onClick={row.onClick}
            className={row.className}
          />
        ))}
      </div>
    </div>
  );
};

export default Table;
