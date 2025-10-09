import { LoadingField } from "@/components";
import clsx from "clsx";
import React from "react";

interface TitleLabelProps {
  label?: string;
  title: string;
  leftIcon?: React.ReactNode;
  secondaryTitle?: string;
  className?: string;
  titleClassName?: string;
  isLoading?: boolean;
}

const TitleLabel: React.FC<TitleLabelProps> = ({
  label,
  title,
  leftIcon,
  secondaryTitle,
  className = "",
  titleClassName = "",
  isLoading = false,
}) => {
  return (
    <div
      className={clsx("flex flex-col gap-1 sm:gap-2 mb-4 sm:mb-6 lg:mb-8 mt-2 sm:mt-4", className)}
    >
      {label && (
        <label className="block font-montserrat font-normal text-xs sm:text-sm leading-none text-neutral h-3 sm:h-4 !rounded">
          {label}
        </label>
      )}
      {isLoading ? (
        <div className="flex items-center gap-2 sm:gap-3">
          {leftIcon && <LoadingField variant="rounded" />}
          <LoadingField className="!h-6" />
        </div>
      ) : (
        <div className="flex items-center gap-2 sm:gap-3">
          {leftIcon && leftIcon}
          <h4
            className={clsx(
              "font-montserrat font-bold text-lg sm:text-xl leading-none text-textLight",
              titleClassName,
            )}
          >
            {title}
          </h4>
          {secondaryTitle && (
            <span className="font-montserrat font-large text-sm sm:text-base leading-none text-textLight">
              ({secondaryTitle})
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TitleLabel;
