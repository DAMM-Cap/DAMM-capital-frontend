import React from "react";

interface FundProps {
  leftIcon: React.ReactNode;
  title: string;
  subtitle: string;
  secondColumnText: string;
  thirdColumnText: string;
  fourthColumnText: string;
  tokenIcon: React.ReactNode;
  tokenName: string;
  className?: string;
  onClick?: () => void;
  isLoading?: boolean;
}

const Fund: React.FC<FundProps> = ({
  leftIcon,
  title,
  subtitle,
  secondColumnText,
  thirdColumnText,
  fourthColumnText,
  tokenIcon,
  tokenName,
  className = "",
  onClick,
  isLoading = false,
}) => {
  return (
    <div
      className={`w-full border border-disabledDark hover:border-primary bg-disabled rounded-2xl p-4 transition-colors duration-200 cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="grid grid-cols-12 gap-2 items-center h-[48px] w-full">
        {isLoading ? (
          <>
            {/* First column: Loading skeleton */}
            <div className="col-span-4 w-full">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary rounded-full flex-shrink-0"></div>
                <div className="flex-1 h-6 bg-secondary rounded-2xl"></div>
              </div>
            </div>

            {/* Second column: Loading skeleton */}
            <div className="col-span-2 w-full">
              <div className="w-full h-6 bg-secondary rounded-2xl text-center"></div>
            </div>

            {/* Third column: Loading skeleton */}
            <div className="col-span-2 w-full">
              <div className="w-full h-6 bg-secondary rounded-2xl text-center"></div>
            </div>

            {/* Fourth column: Loading skeleton */}
            <div className="col-span-2 w-full">
              <div className="w-full h-6 bg-secondary rounded-2xl text-center"></div>
            </div>

            {/* Fifth column: Loading skeleton */}
            <div className="col-span-2 w-full">
              <div className="w-full h-6 bg-secondary rounded-2xl text-center"></div>
            </div>
          </>
        ) : (
          <>
            {/* First column: Icon, title, and subtitle */}
            <div className="col-span-4 w-full">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 flex items-center justify-center">
                  {React.isValidElement(leftIcon)
                    ? React.cloneElement(leftIcon as React.ReactElement<{ size?: number }>, {
                        size: 32,
                      })
                    : leftIcon}
                </div>
                <div className="flex-1">
                  <div className="font-montserrat font-bold text-lg leading-none text-textLight">
                    {title}
                  </div>
                  <div className="font-montserrat font-normal text-[10px] leading-none text-textLight mt-1">
                    {subtitle}
                  </div>
                </div>
              </div>
            </div>

            {/* Second column: Green text */}
            <div className="col-span-2 w-full">
              <div className="text-primary font-montserrat font-normal text-xs leading-none text-center">
                {secondColumnText}
              </div>
            </div>

            {/* Third column: Light text */}
            <div className="col-span-2 w-full">
              <div className="text-textLight font-montserrat font-normal text-xs leading-none text-center">
                {thirdColumnText}
              </div>
            </div>

            {/* Fourth column: Light text */}
            <div className="col-span-2 w-full">
              <div className="text-textLight font-montserrat font-normal text-xs leading-none text-center">
                {fourthColumnText}
              </div>
            </div>

            {/* Fifth column: Token icon and name */}
            <div className="col-span-2 w-full">
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0">{tokenIcon}</div>
                <div className="font-montserrat font-normal text-xs leading-none text-textLight">
                  {tokenName}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Fund;
