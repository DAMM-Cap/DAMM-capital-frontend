import clsx from "clsx";
import React from "react";
import { Skeleton } from "../index";

const FundSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={clsx(
      "w-full border border-disabledDark hover:border-primary bg-disabled rounded-2xl p-3 sm:p-4 transition-colors duration-200 cursor-pointer",
      className,
    )}
  >
    {/* Mobile Layout */}
    <div className="block sm:hidden">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton variant="rounded" />
        <div className="flex-1">
          <Skeleton />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    </div>

    {/* Desktop Layout */}
    <div className="hidden sm:grid grid-cols-12 gap-2 items-center h-12 !rounded w-full">
      {/* First column: Loading skeleton */}
      <div className="col-span-4 w-full">
        <div className="flex items-center gap-3">
          <Skeleton variant="rounded" />
          <Skeleton />
        </div>
      </div>

      {/* Second column: Loading skeleton */}
      <div className="col-span-2 w-full">
        <Skeleton />
      </div>

      {/* Third column: Loading skeleton */}
      <div className="col-span-2 w-full">
        <Skeleton />
      </div>

      {/* Fourth column: Loading skeleton */}
      <div className="col-span-2 w-full">
        <Skeleton />
      </div>

      {/* Fifth column: Loading skeleton */}
      <div className="col-span-2 w-full">
        <Skeleton />
      </div>
    </div>
  </div>
);

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
  if (isLoading) {
    return <FundSkeleton className={className} />;
  }

  return (
    <div
      className={clsx(
        "w-full border border-disabledDark hover:border-primary bg-disabled rounded-2xl p-3 sm:p-4 transition-colors duration-200 cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      {/* Mobile Layout */}
      <div className="block sm:hidden">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="flex-shrink-0 flex items-center justify-center">
            {React.isValidElement(leftIcon)
              ? React.cloneElement(leftIcon as React.ReactElement<{ size?: number }>, {
                  size: 28,
                })
              : leftIcon}
          </div>
          <div className="text-center">
            <div className="font-montserrat font-bold text-base leading-none text-textLight">
              {title}
            </div>
            <div className="font-montserrat font-normal text-tiny leading-none text-textLight mt-1">
              {subtitle}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-5">
          {/* Net APY */}
          <div className="text-center">
            <div className="font-montserrat font-normal text-tiny leading-none text-neutral mb-1">
              Net APY
            </div>
            <div className="text-primary font-montserrat font-normal text-xs leading-none">
              {secondColumnText}
            </div>
          </div>

          {/* 30 days Net APY */}
          <div className="text-center">
            <div className="font-montserrat font-normal text-tiny leading-none text-neutral mb-1">
              30 days Net APY
            </div>
            <div className="text-textLight font-montserrat font-normal text-xs leading-none">
              {thirdColumnText}
            </div>
          </div>

          {/* AUM */}
          <div className="text-center mt-3">
            <div className="font-montserrat font-normal text-tiny leading-none text-neutral mb-1">
              AUM
            </div>
            <div className="text-textLight font-montserrat font-normal text-xs leading-none">
              {fourthColumnText}
            </div>
          </div>

          {/* Underlying Asset */}
          <div className="text-center mt-3">
            <div className="font-montserrat font-normal text-tiny leading-none text-neutral mb-1">
              Underlying Asset
            </div>
            <div className="flex items-center justify-center gap-1">
              <div className="flex-shrink-0">{tokenIcon}</div>
              <div className="font-montserrat font-normal text-xs leading-none text-textLight">
                {tokenName}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:grid grid-cols-12 gap-2 items-center h-12 !rounded w-full">
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
              <div className="font-montserrat font-normal text-tiny leading-none text-textLight mt-1">
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
      </div>
    </div>
  );
};

export default Fund;
