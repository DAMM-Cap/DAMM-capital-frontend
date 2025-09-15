import clsx from "clsx";
import { useState } from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "tertiary" | "disabled" | "loading";
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
  const isDisabled = variant === "disabled" || disabled || variant === "loading" || isLoading;

  const commonClasses = clsx(
    "px-4 py-2 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 font-montserrat font-medium text-base leading-none text-center focus:outline-none",
    className,
    {
      // disabled
      "bg-disabled border-2 border-disabled text-textMuted cursor-not-allowed": isDisabled,
      // loading
      "bg-primary border-2 border-primary text-textDark": variant === "loading" || isLoading,
      // primary
      "bg-primary border-2 border-primary text-textDark cursor-pointer":
        variant === "primary" && !isHovered && !isClicked,
      "bg-neutral border-2 border-neutral text-textDark": variant === "primary" && isHovered,
      "bg-primary border-2 border-primary text-textDark cursor-pointer opacity-90":
        variant === "primary" && isClicked,
      // secondary
      "bg-secondary border-2 border-secondary text-textLight":
        variant === "secondary" && !isHovered && !isClicked,
      "bg-neutral border-2 border-neutral text-textDark cursor-pointer":
        variant === "secondary" && isHovered,
      "bg-secondary border-2 border-secondary text-textLight cursor-pointer opacity-80":
        variant === "secondary" && isClicked,
      // tertiary
      "bg-accent border-2 border-accent text-textDark":
        variant === "tertiary" && !isHovered && !isClicked,
      "bg-neutral border-2 border-neutral text-textDark cursor-pointer opacity-95":
        variant === "tertiary" && isHovered,
      "bg-accent border-2 border-accent text-textDark cursor-pointer opacity-80":
        variant === "tertiary" && isClicked,
    },
  );

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`px-4 py-2 rounded-2xl ${commonClasses} ${className}`}
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
