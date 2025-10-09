import clsx from "clsx";
import { ChevronDownIcon } from "lucide-react";
import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
  label: string;
  leftIcon?: React.ReactNode;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  secondaryLabel?: string;
  secondaryLabelAlign?: "left" | "right";
  block?: boolean;
}

export default function Select({
  children,
  label,
  leftIcon,
  className,
  secondaryLabel,
  secondaryLabelAlign = "left",
  onChange,
  block,
  ...props
}: SelectProps) {
  return (
    <div className={clsx("flex flex-col", className)}>
      {label && (
        <label className="block mb-1 sm:mb-2 font-montserrat font-normal text-xs sm:text-sm leading-none text-neutral h-[1.2em]">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2">
            {leftIcon}
          </div>
        )}
        <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDownIcon className="w-4 h-4 text-neutral" />
        </div>
        <select
          className={clsx(
            "appearance-none",
            leftIcon ? "pl-10 sm:pl-12 pr-12 sm:pr-16" : "pl-3 sm:pl-4 pr-12 sm:pr-16",
          )}
          {...props}
          onChange={onChange}
          disabled={block}
        >
          {children}
        </select>
      </div>
      {/* Secondary Label */}
      {secondaryLabel && (
        <div className="mt-1 sm:mt-2 h-4 sm:h-5 items-center">
          <div
            className={clsx(
              "font-montserrat font-normal text-[0.625rem] sm:text-xs leading-none text-neutral",
              {
                "text-right": secondaryLabelAlign === "right",
                "text-left": secondaryLabelAlign === "left",
              },
            )}
          >
            {secondaryLabel}
          </div>
        </div>
      )}
    </div>
  );
}
