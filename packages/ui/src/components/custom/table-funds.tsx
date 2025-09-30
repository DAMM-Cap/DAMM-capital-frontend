import clsx from "clsx";
import React from "react";
import { useIsMobile } from "../hooks/use-is-mobile";
import Fund from "./fund";

interface FundData {
  leftIcon: React.ReactNode;
  title: string;
  subtitle?: string;
  secondColumnText?: string;
  thirdColumnText?: string;
  fourthColumnText?: string;
  tokenIcon?: React.ReactNode;
  tokenName: string;
  onClick?: () => void;
  isLoading?: boolean;
}

interface TableFundsProps {
  tableHeaders: string[];
  funds: FundData[];
  className?: string;
}

const TableFunds: React.FC<TableFundsProps> = ({ tableHeaders, funds, className = "" }) => {
  const isMobile = useIsMobile();

  // Dynamic grid configuration based on number of headers
  const getGridConfig = (headerCount: number) => {
    switch (headerCount) {
      case 1:
        return { gridCols: "grid-cols-1", colSpans: ["col-span-1"] };
      case 2:
        return { gridCols: "grid-cols-2", colSpans: ["col-span-1", "col-span-1"] };
      case 3:
        return { gridCols: "grid-cols-3", colSpans: ["col-span-1", "col-span-1", "col-span-1"] };
      case 4:
        return {
          gridCols: "grid-cols-4",
          colSpans: ["col-span-1", "col-span-1", "col-span-1", "col-span-1"],
        };
      case 5:
        return {
          gridCols: "grid-cols-12",
          colSpans: ["col-span-4", "col-span-2", "col-span-2", "col-span-2", "col-span-2"],
        };
      default:
        // Fallback to 12-column grid for more than 5 headers
        return {
          gridCols: "grid-cols-12",
          colSpans: tableHeaders.map((_, index) => (index === 0 ? "col-span-4" : "col-span-2")),
        };
    }
  };

  const gridConfig = getGridConfig(tableHeaders.length);

  return (
    <div className={clsx("w-full mx-auto", className)}>
      {/* Desktop Header */}
      {!isMobile && (
        <div className={clsx("grid gap-2 items-center mb-4 px-4", gridConfig.gridCols)}>
          {tableHeaders.map((item, index) => (
            <div key={index} className={gridConfig.colSpans[index] || "col-span-1"}>
              <div
                className={clsx(
                  "font-montserrat font-normal text-tiny leading-none text-neutral",
                  // For 2 headers: first left-aligned, second right-aligned
                  tableHeaders.length === 2
                    ? index === 0
                      ? "text-left"
                      : "text-right"
                    : // For other cases: first left-aligned, last right-aligned, rest centered
                      index === 0
                      ? "text-left"
                      : index === tableHeaders.length - 1
                        ? "text-right"
                        : "text-center",
                )}
              >
                {item}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Funds */}
      <div className="space-y-2">
        {funds.map((fund, index) => (
          <Fund
            key={index}
            leftIcon={fund.leftIcon}
            title={fund.title}
            subtitle={fund.subtitle}
            secondColumnText={fund.secondColumnText}
            thirdColumnText={fund.thirdColumnText}
            fourthColumnText={fund.fourthColumnText}
            tokenIcon={fund.tokenIcon}
            tokenName={fund.tokenName}
            onClick={fund.onClick}
            isLoading={fund.isLoading}
            className="w-full"
          />
        ))}
      </div>
    </div>
  );
};

export default TableFunds;
