interface CheckIconProps {
  color?: string;
  size?: number;
}

export default function CheckIcon({ color = "#14B8A6", size = 20 }: CheckIconProps) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      viewBox="0 0 20 20"
      style={{
        width: size,
        height: size,
        color: color,
        strokeWidth: 1.5,
      }}
    >
      <path d="M6 10L9 13L16 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
