import React from "react";

interface CardProps {
  leftIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ leftIcon, children, className = "" }) => {
  return (
    <div className={`border border-[#18181B] bg-[#09090B] rounded-2xl p-4 my-4 ${className}`}>
      <div className="flex items-center gap-3">
        {leftIcon && <div className="flex-shrink-0">{leftIcon}</div>}
        <div className="font-montserrat font-normal text-xs leading-none text-[#BDBDBD]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Card;
