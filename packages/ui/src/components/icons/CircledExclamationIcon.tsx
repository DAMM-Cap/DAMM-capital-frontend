import React from "react";

interface CircledExclamationIconProps {
  size?: number;
  color?: string;
}

const CircledExclamationIcon: React.FC<CircledExclamationIconProps> = ({
  size = 16,
  color = "currentColor",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Circle */}
      <circle cx="12" cy="12" r="10" />

      {/* Vertically mirrored exclamation mark */}
      <path d="M12 18v-6" />
      <path d="M12 6h.01" />
    </svg>
  );
};

export default CircledExclamationIcon;
