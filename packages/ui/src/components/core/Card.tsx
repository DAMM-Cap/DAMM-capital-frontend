import React from "react";

interface CardProps {
  leftIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "fund";
}

const Card: React.FC<CardProps> = ({ leftIcon, children, className = "", variant = "default" }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "fund":
        return "bg-[#18181BCC]";
      default:
        return "bg-[#09090B]";
    }
  };

  return (
    <div
      className={`border border-[#18181B] ${getVariantStyles()} rounded-2xl p-4 my-4 ${className}`}
    >
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
