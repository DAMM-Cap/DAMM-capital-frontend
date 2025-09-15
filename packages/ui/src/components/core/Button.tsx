import { useState } from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "disabled" | "loading";
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  isLoading = false,
  className = "",
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const commonClasses =
    "transition-all duration-200 flex items-center justify-center gap-3 font-montserrat font-medium text-base leading-none text-center focus:outline-none focus:ring-0 focus:border-0";

  const getButtonStyles = () => {
    if (variant === "disabled" || disabled) {
      return {
        backgroundColor: "#18181BCC",
        color: "#BDBDBD",
        border: "2px solid #18181BCC",
      };
    }

    if (variant === "loading" || isLoading) {
      return {
        backgroundColor: "#A3E635",
        color: "#000000",
        border: "2px solid #A3E635",
      };
    }

    if (variant === "primary") {
      if (isClicked) {
        return {
          backgroundColor: "#A3E635",
          color: "#000000",
          border: "2px solid #A3E635",
        };
      }
      if (isHovered) {
        return {
          backgroundColor: "#BDBDBD",
          color: "#000000",
          border: "2px solid #BDBDBD",
        };
      }
      return {
        backgroundColor: "#A3E635",
        color: "#000000",
        border: "2px solid #A3E635",
      };
    }

    if (variant === "secondary") {
      if (isClicked) {
        return {
          backgroundColor: "#F7FEE7",
          color: "#09090B",
          border: "2px solid #F7FEE7",
        };
      }
      if (isHovered) {
        return {
          backgroundColor: "#BDBDBD",
          color: "#000000",
          border: "2px solid #BDBDBD",
        };
      }
      return {
        backgroundColor: "#F7FEE7",
        color: "#09090B",
        border: "2px solid #F7FEE7",
      };
    }

    return {};
  };

  const isDisabled = variant === "disabled" || disabled || variant === "loading" || isLoading;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`px-4 py-2 rounded-2xl ${commonClasses} ${className}`}
      style={getButtonStyles()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsClicked(true)}
      onMouseUp={() => setIsClicked(false)}
    >
      {variant === "loading" || isLoading ? (
        <div className="flex items-center gap-2">
          <span>{children}</span>
          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
