import React from "react";
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
  return (
    <div className={`w-full mx-auto ${className}`}>
      {/* Header */}
      <div className="grid grid-cols-12 gap-2 items-center mb-4 px-4">
        <div className="col-span-4">
          <div className="font-montserrat font-normal text-[10px] leading-none text-[#BDBDBD] text-left">
            Name
          </div>
        </div>
        <div className="col-span-2">
          <div className="font-montserrat font-normal text-[10px] leading-none text-[#BDBDBD] text-center">
            Net APY
          </div>
        </div>
        <div className="col-span-2">
          <div className="font-montserrat font-normal text-[10px] leading-none text-[#BDBDBD] text-center">
            30 days Net APY
          </div>
        </div>
        <div className="col-span-2">
          <div className="font-montserrat font-normal text-[10px] leading-none text-[#BDBDBD] text-center">
            AUM
          </div>
        </div>
        <div className="col-span-2">
          <div className="font-montserrat font-normal text-[10px] leading-none text-[#BDBDBD] text-left">
            Underlying Asset
          </div>
        </div>
      </div>

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
