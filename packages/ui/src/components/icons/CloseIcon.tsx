const CloseIcon = ({
  className = "w-5 h-5",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    style={{ strokeWidth }}
  >
    <path d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default CloseIcon;
