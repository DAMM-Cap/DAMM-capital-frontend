import clsx from "clsx";
import { AlertCircleIcon as AlertIcon, CheckIcon } from "lucide-react";
import React from "react";
import CircledExclamationIcon from "../icons/CircledExclamationIcon";
import Button from "./Button";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: "text" | "email" | "password" | "number";
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
  ...props
}: InputProps) {
  const inputClassName = clsx("input-base", {
    "!border-invalid": validation === "invalid",
    "!border-success": validation === "success",
    "!bg-disabled !border-secondary !text-neutral": noEdit, // noEdit is disabled input forced to default styles
    "!pl-12": leftIcon,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block mb-2 font-montserrat font-normal text-sm leading-none text-neutral h-[1.2em]">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">{leftIcon}</div>
        )}
        <input
          {...props}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled || noEdit}
          className={inputClassName}
        />

        {/* Validation Icon */}
        {validation === "invalid" && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <AlertIcon color="var(--color-invalid)" size={16} />
          </div>
        )}

        {validation === "success" && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <CheckIcon className="text-success" size={14} />
          </div>
        )}

        {max && onMaxClick && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Button
              onClick={onMaxClick}
              variant="secondary"
              disabled={noEdit}
              className="w-[42px] h-[21px] !rounded"
            >
              max.
            </Button>
          </div>
        )}
      </div>

      {/* Always reserve space for bottom content */}
      <div className="mt-2 h-[20px] items-center">
        {/* Validation Message */}
        {validation && validationMessage && (
          <div
            className={clsx("font-inter font-normal text-sm leading-none tracking-wider", {
              "text-invalid": validation === "invalid",
              "text-success": validation === "success",
            })}
          >
            {validationMessage}
          </div>
        )}

        {/* Secondary Label */}
        {secondaryLabel && !validation && (
          <div
            className={clsx("font-montserrat font-normal text-xs leading-none text-neutral", {
              "text-right": secondaryLabelAlign === "right",
              "text-left": secondaryLabelAlign === "left",
            })}
          >
            {secondaryLabel}
          </div>
        )}

        {/* Complex Label */}
        {complexLabel && !validation && (
          <div
            className={clsx(
              "font-montserrat font-normal text-xs leading-none flex items-center gap-2",
              {
                "justify-end": complexLabel.align === "right",
                "justify-start": complexLabel.align === "left",
              },
            )}
          >
            <span className="text-neutral">{complexLabel.leftText}</span>
            <span className="text-neutral">{complexLabel.icon}</span>
            <span className="text-primary flex items-center gap-1">
              {complexLabel.rightText} <CircledExclamationIcon size={14} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
