import clsx from "clsx";

function LoadingField({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "rounded" | "default";
}) {
  return (
    <div
      className={clsx(
        "bg-secondary",
        { "w-8 h-8 rounded-full flex-shrink-0": variant === "rounded" },
        { "w-full h-6 rounded-2xl text-center": variant === "default" },
        className,
      )}
    />
  );
}

export default LoadingField;
