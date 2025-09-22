import React from "react";

interface TitleComponentProps {
  label?: string;
  title: string;
  leftIcon?: React.ReactNode;
  secondaryTitle?: string;
  className?: string;
}

const TitleComponent: React.FC<TitleComponentProps> = ({
  label,
  title,
  leftIcon,
  secondaryTitle,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-2 mb-8 mt-4 ${className}`}>
      {label && (
        <label className="block font-montserrat font-normal text-sm leading-none text-neutral w-[400px] h-[17px]">
          {label}
        </label>
      )}
      <div className="flex items-center gap-3">
        {leftIcon && leftIcon}
        <h4 className="font-montserrat font-bold text-xl leading-none text-textLight">{title}</h4>
        {secondaryTitle && (
          <span className="font-montserrat font-large text-base leading-none text-textLight">
            ({secondaryTitle})
          </span>
        )}
      </div>
    </div>
  );
};

export default TitleComponent;
