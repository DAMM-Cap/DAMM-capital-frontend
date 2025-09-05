interface AlertIconProps {
  color?: string;
  size?: number;
}

export default function AlertIcon({ color = "#EF4444", size = 16 }: AlertIconProps) {
  return (
    <div
      className="rounded-full border flex items-center justify-center"
      style={{
        width: size,
        height: size,
        borderColor: color,
      }}
    >
      <span
        className="font-bold text-center leading-none"
        style={{
          color: color,
          fontSize: size * 0.6,
          lineHeight: 1,
        }}
      >
        !
      </span>
    </div>
  );
}
