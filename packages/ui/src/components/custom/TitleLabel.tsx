import clsx from "clsx";
import React from "react";

interface TitleLabelProps {
  label?: string;
  title: string;
  leftIcon?: React.ReactNode;
  secondaryTitle?: string;
  className?: string;
  titleClassName?: string;
}

const TitleLabel: React.FC<TitleLabelProps> = ({
  label,
  title,
  leftIcon,
  secondaryTitle,
  className = "",
  titleClassName = "",
}) => {
  return (
    <div className={clsx("flex flex-col gap-2 mb-8 mt-4", className)}>
      {label && (
        <label className="block font-montserrat font-normal text-sm leading-none text-neutral h-4 !rounded">
          {label}
        </label>
      )}
      <div className="flex items-center gap-3">
        {leftIcon && leftIcon}
        <h4
          className={clsx(
            "font-montserrat font-bold text-xl leading-none text-textLight",
            titleClassName,
          )}
        >
          {title}
        </h4>
        {secondaryTitle && (
          <span className="font-montserrat font-large text-base leading-none text-textLight">
            ({secondaryTitle})
          </span>
        )}
      </div>
    </div>
  );
};

export default TitleLabel;
