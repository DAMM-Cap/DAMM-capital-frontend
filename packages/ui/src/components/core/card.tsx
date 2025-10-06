import clsx from "clsx";
import React from "react";

interface CardProps {
  leftIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "fund";
}

const Card: React.FC<CardProps> = ({ leftIcon, children, className = "", variant = "default" }) => {
  const variantClasses = clsx({
    "bg-disabled": variant === "fund",
    "bg-textDark": variant === "default",
  });

  return (
    <div className={clsx("card", variantClasses, className)}>
      {leftIcon ? (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">{leftIcon}</div>
          <div className="font-montserrat font-normal text-xs leading-none text-neutral">
            {children}
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default Card;
