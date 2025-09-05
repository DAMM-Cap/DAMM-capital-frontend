import React, { useState } from "react";

interface Button2Props {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export default function Button2({
  children,
  onClick,
  disabled = false,
  className = "",
}: Button2Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const baseClasses =
    "px-4 py-2 rounded-2xl font-montserrat font-normal text-sm leading-none transition-all duration-200 flex items-center justify-center border focus:outline-none focus:ring-0 focus:border-0";

  const getButtonStyles = () => {
    if (disabled) {
      return {
        backgroundColor: "#09090B",
        color: "#505050",
        border: "1px solid #09090B",
      };
    }

    if (isClicked) {
      return {
        backgroundColor: "#505050",
        color: "#000000",
        border: "1px solid #505050",
      };
    }

    if (isHovered) {
      return {
        backgroundColor: "#BDBDBD",
        color: "#09090B",
        border: "1px solid #BDBDBD",
      };
    }

    return {
      backgroundColor: "#505050",
      color: "#F7FEE7",
      border: "1px solid #505050",
    };
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${className}`}
      style={getButtonStyles()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsClicked(true)}
      onMouseUp={() => setIsClicked(false)}
    >
      {children}
    </button>
  );
}
