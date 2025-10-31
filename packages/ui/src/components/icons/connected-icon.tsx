import { Icon } from "@/components";

const ConnectedIcon = ({ color = "#A3E635" }: { color?: string }) => (
  <Icon color={color} stroke={color} className="lucide lucide-circle-icon lucide-circle">
    <circle cx="12" cy="12" r="10" />
  </Icon>
);

export default ConnectedIcon;
