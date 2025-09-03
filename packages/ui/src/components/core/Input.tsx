import React, { useState } from "react";
import AlertIcon from "../icons/AlertIcon";
import CheckIcon from "../icons/CheckIcon";
import CircledExclamationIcon from "../icons/CircledExclamationIcon";
import Button2 from "./Button2";

interface InputProps {
  type?: "text" | "email" | "password" | "number";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  noEdit?: boolean;
  max?: number;
  onMaxClick?: () => void;
  validation?: "invalid" | "success" | null;
  validationMessage?: string;
  secondaryLabel?: string;
  secondaryLabelAlign?: "left" | "right";
  complexLabel?: {
    leftText: string;
    icon: React.ReactNode;
    rightText: string;
    align?: "left" | "right";
  };
  leftIcon?: React.ReactNode;
  className?: string;
}

export default function Input({
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  label = "",
  noEdit = false,
  max,
  onMaxClick,
  validation = null,
  validationMessage = "",
  secondaryLabel,
  secondaryLabelAlign = "left",
  complexLabel,
  leftIcon,
  className,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const baseClasses =
    "w-full h-12 rounded-lg font-montserrat font-medium text-base leading-none transition-all duration-200 focus:outline-none focus:ring-0 focus:border-0 px-4";

  const getInputStyles = () => {
    if (disabled) {
      return {
        backgroundColor: "#09090B",
        border: "1px solid #18181B",
        color: "#303030",
      };
    }

    if (validation === "invalid") {
      return {
        backgroundColor: "#18181B",
        border: "1px solid #EF4444",
        color: "#BDBDBD",
      };
    }

    if (validation === "success") {
      return {
        backgroundColor: "#18181B",
        border: "1px solid #14B8A6",
        color: "#BDBDBD",
      };
    }

    if (isFocused || hasValue) {
      return {
        backgroundColor: "#18181B",
        border: "1px solid #A3E635",
        color: "#BDBDBD",
      };
    }

    if (isHovered) {
      return {
        backgroundColor: "#505050",
        border: "1px solid #505050",
        color: "#BDBDBD",
      };
    }

    return {
      backgroundColor: "#18181B",
      border: "1px solid #505050",
      color: "#BDBDBD",
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setHasValue(newValue.length > 0);
    onChange(newValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setHasValue(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block mb-2 font-montserrat font-normal text-sm leading-none text-[#BDBDBD] w-[400px] h-[17px]">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">{leftIcon}</div>
        )}
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled || noEdit}
          className={`${baseClasses} ${leftIcon ? "pl-12" : ""}`}
          style={getInputStyles()}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />

        {/* Validation Icon */}
        {validation === "invalid" && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <AlertIcon color="#EF4444" />
          </div>
        )}

        {validation === "success" && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <CheckIcon color="#14B8A6" />
          </div>
        )}

        {max && onMaxClick && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Button2 onClick={onMaxClick}>max.</Button2>
          </div>
        )}
      </div>

      {/* Validation Message */}
      {validation && validationMessage && (
        <div
          className={`mt-2 font-inter font-medium text-sm leading-none tracking-wider ${
            validation === "invalid" ? "text-[#EF4444]" : "text-[#14B8A6]"
          }`}
        >
          {validationMessage}
        </div>
      )}

      {/* Secondary Label */}
      {secondaryLabel && (
        <div
          className={`mt-2 font-montserrat font-normal text-xs leading-none text-[#BDBDBD] ${
            secondaryLabelAlign === "right" ? "text-right" : "text-left"
          }`}
        >
          {secondaryLabel}
        </div>
      )}

      {/* Complex Label */}
      {complexLabel && (
        <div
          className={`mt-2 font-montserrat font-normal text-xs leading-none flex items-center gap-2 ${
            complexLabel.align === "right" ? "justify-end" : "justify-start"
          }`}
        >
          <span className="text-[#BDBDBD]">{complexLabel.leftText}</span>
          <span className="text-[#BDBDBD]">{complexLabel.icon}</span>
          <span className="text-[#A3E635] flex items-center gap-1">
            {complexLabel.rightText} <CircledExclamationIcon />
          </span>
        </div>
      )}
    </div>
  );
}
