import Icon from "@/components/core/Icon";

const CircledExclamationIcon = ({
  size = 14,
  className = "w-4 h-4 stroke-[1.5]",
}: {
  size?: number;
  className?: string;
}) => (
  <Icon size={size} className={className}>
    {/* Circle */}
    <circle cx="12" cy="12" r="10" />

    {/* Vertically mirrored exclamation mark */}
    <path d="M12 18v-6" />
    <path d="M12 6h.01" />
  </Icon>
);

export default CircledExclamationIcon;
