interface IconProps {
  size?: number;
  color?: string;
  stroke?: string;
  className?: string;
  children: React.ReactNode;
}

const Icon = ({
  size = 24,
  color = "none",
  stroke = "currentColor",
  className = "",
  children,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    stroke={stroke}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

export default Icon;
