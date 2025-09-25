const ConnectedIcon = ({ color = "#A3E635" }: { color?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={color}
    className="lucide lucide-circle-icon lucide-circle"
  >
    <circle cx="12" cy="12" r="10" />
  </svg>
);

export default ConnectedIcon;
