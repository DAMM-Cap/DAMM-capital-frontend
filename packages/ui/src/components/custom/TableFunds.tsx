import clsx from "clsx";
import React from "react";
import { useIsMobile } from "../hooks/use-is-mobile";
import Fund from "./Fund";

interface FundData {
  leftIcon: React.ReactNode;
  title: string;
  subtitle: string;
  secondColumnText: string;
  thirdColumnText: string;
  fourthColumnText: string;
  tokenIcon: React.ReactNode;
  tokenName: string;
  onClick?: () => void;
  isLoading?: boolean;
}

interface TableFundsProps {
  funds: FundData[];
  className?: string;
}

const TableFunds: React.FC<TableFundsProps> = ({ funds, className = "" }) => {
  const isMobile = useIsMobile();

  return (
    <div className={clsx("w-full mx-auto", className)}>
      {/* Desktop Header */}
      {!isMobile && (
        <div className="grid grid-cols-12 gap-2 items-center mb-4 px-4">
          {["Name", "Net APY", "30 days Net APY", "AUM", "Underlying Asset"].map((item, index) => (
            <div key={index} className={clsx("col-span-2", { "!col-span-4": index === 0 })}>
              <div
                className={clsx(
                  "font-montserrat font-normal text-tiny leading-none text-neutral text-center",
                  { "!text-left": index === 0 || index === 4 },
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
