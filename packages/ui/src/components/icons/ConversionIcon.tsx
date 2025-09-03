import React from "react";

interface ConversionIconProps {
  size?: number;
  color?: string;
  className?: string;
}

const ConversionIcon: React.FC<ConversionIconProps> = ({
  size = 24,
  color = "currentColor",
  className = "size-6",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke={color}
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 5.5 5 9m0 0 3 3M5 9h14" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 18.5 19 15m0 0-3-3M19 15H5" />
    </svg>
  );
};

export default ConversionIcon;
