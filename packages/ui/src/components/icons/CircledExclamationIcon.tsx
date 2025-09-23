import clsx from "clsx";

const CircledExclamationIcon = ({
  size = 14,
  className = "w-4 h-4 stroke-[1.5]",
}: {
  size?: number;
  className?: string;
}) => {
  const sizeClass = size <= 12 ? "w-3 h-3" : size <= 16 ? "w-4 h-4" : "w-5 h-5";

  return (
    <img
      src="/circled-exclamation.svg"
      alt="Circled Exclamation Icon"
      className={clsx(sizeClass, className)}
    />
  );
};

export default CircledExclamationIcon;
