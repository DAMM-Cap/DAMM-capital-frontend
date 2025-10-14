import clsx from "clsx";

const CircledExclamationIcon = ({
  size = 14,
  className = "w-4 h-4",
}: {
  size?: number;
  className?: string;
}) => {
  const sizeClass = size <= 12 ? "w-3 h-3" : size <= 16 ? "w-4 h-4" : "w-5 h-5";

  return (
    <svg
      className={clsx(sizeClass, className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6" />
      <path d="M12 16h.01" />
    </svg>
  );
};

export default CircledExclamationIcon;
