import { LoadingField } from "@/components";
import clsx from "clsx";
import React from "react";

interface LabelProps {
  label: React.ReactNode;
  secondaryLabel?: string;
  secondaryLabelAlign?: "left" | "right";
  className?: string;
  isLoading?: boolean;
}

const Label: React.FC<LabelProps> = ({
  label,
  secondaryLabel,
  secondaryLabelAlign = "left",
  className = "",
  isLoading = false,
}) => {
  return isLoading ? (
    <div className={clsx("flex items-center justify-between", className)}>
      <LoadingField className="!h-4" />
    </div>
  ) : (
    <div className={clsx("flex items-center justify-between", className)}>
      <label
        className={clsx("font-montserrat font-normal text-xs leading-none text-neutral", className)}
      >
        {label}
      </label>
      {secondaryLabel && (
        <span
          className={clsx("font-montserrat font-normal text-xs leading-none text-neutral", {
            "text-right": secondaryLabelAlign === "right",
            "text-left": secondaryLabelAlign === "left",
          })}
        >
          {secondaryLabel}
        </span>
      )}
    </div>
  );
};

export default Label;
