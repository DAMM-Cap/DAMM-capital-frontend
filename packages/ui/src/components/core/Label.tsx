import React from "react";

interface LabelProps {
  label: React.ReactNode;
  secondaryLabel?: string;
  secondaryLabelAlign?: "left" | "right";
  className?: string;
}

const Label: React.FC<LabelProps> = ({
  label,
  secondaryLabel,
  secondaryLabelAlign = "left",
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <label
        className={`font-montserrat font-normal text-xs leading-none text-[#BDBDBD] ${className}`}
      >
        {label}
      </label>
      {secondaryLabel && (
        <span
          className={`font-montserrat font-normal text-xs leading-none text-[#BDBDBD] ${secondaryLabelAlign === "right" ? "text-right" : "text-left"}`}
        >
          {secondaryLabel}
        </span>
      )}
    </div>
  );
};

export default Label;
