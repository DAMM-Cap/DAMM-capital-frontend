import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary";
  isLoading?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  isLoading = false,
  className = "",
  ...props
}: ButtonProps) {
  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-primary border-primary text-textDark \
      hover:bg-neutral hover:border-neutral hover:text-textDark \
      active:bg-primary active:border-primary active:text-textDark active:opacity-90 \
      cursor-pointer",
    secondary:
      "bg-secondary border-secondary text-textLight \
      hover:bg-neutral hover:border-neutral hover:text-textDark \
      active:bg-secondary active:border-secondary active:text-textLight active:opacity-80 \
      cursor-pointer",
    tertiary:
      "bg-accent border-accent text-textDark \
      hover:bg-neutral hover:border-neutral hover:text-textDark hover:opacity-95 \
      active:bg-accent active:border-accent active:text-textDark active:opacity-80 \
      cursor-pointer",
  };

  const disabledClasses = "!bg-disabled !border-disabled !text-textMuted !cursor-not-allowed";

  const loadingClasses = "!bg-primary !border-primary !text-textDark";

  const buttonClasses = clsx(
    "button-base",
    variants[variant],
    className,
    disabled && disabledClasses,
    isLoading && loadingClasses,
  );

  return (
    <button
      {...props}
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled || isLoading}
      aria-busy={isLoading}
      data-loading={isLoading || undefined}
      className={buttonClasses}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <span>{children}</span>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        children
      )}
    </button>
  );
}
