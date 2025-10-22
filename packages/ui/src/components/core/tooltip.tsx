import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";

export type TooltipPosition = "top" | "bottom" | "left" | "right" | "auto";
export type TooltipVariant = "default" | "info" | "warning" | "error" | "success";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: TooltipPosition;
  variant?: TooltipVariant;
  delay?: number;
  disabled?: boolean;
  className?: string;
  trigger?: "hover" | "click" | "focus";
}

export default function Tooltip({
  content,
  children,
  position = "top",
  variant = "default",
  delay = 200,
  disabled = false,
  className = "",
  trigger = "hover",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState<TooltipPosition>(position);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Auto-positioning logic
  useEffect(() => {
    if (!isVisible || position !== "auto" || !tooltipRef.current || !triggerRef.current) return;

    const tooltip = tooltipRef.current;
    const trigger = triggerRef.current;
    const rect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let newPosition: TooltipPosition = "top";

    // Check if tooltip fits in each direction
    if (rect.top - tooltipRect.height > 0) {
      newPosition = "top";
    } else if (rect.bottom + tooltipRect.height < viewport.height) {
      newPosition = "bottom";
    } else if (rect.left - tooltipRect.width > 0) {
      newPosition = "left";
    } else if (rect.right + tooltipRect.width < viewport.width) {
      newPosition = "right";
    } else {
      newPosition = "top"; // fallback
    }

    setActualPosition(newPosition);
  }, [isVisible, position]);

  const showTooltip = () => {
    if (disabled) return;
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setTimeoutId(null);
    setIsVisible(false);
  };

  const handleClick = () => {
    if (trigger === "click") {
      setIsVisible(!isVisible);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (trigger === "focus" && (e.key === "Escape" || e.key === "Tab")) {
      hideTooltip();
    }
  };

  const variantStyles = {
    default: "bg-textDark border-secondary text-textLight",
    info: "bg-primary border-primary text-textDark",
    warning: "bg-accent border-accent text-textDark",
    error: "bg-invalid border-invalid text-textLight",
    success: "bg-success border-success text-textLight",
  };

  const getPositionStyles = (pos: TooltipPosition) => {
    return clsx("absolute z-50 transition-all duration-200 ease-out", {
      "-top-2 left-1/2 -translate-x-1/2 -translate-y-full": pos === "top",
      "-bottom-2 left-1/2 -translate-x-1/2 translate-y-full": pos === "bottom",
      "left-0 top-1/2 -translate-x-full -translate-y-1/2": pos === "left",
      "right-0 top-1/2 translate-x-full -translate-y-1/2": pos === "right",
    });
  };

  const currentPosition = position === "auto" ? actualPosition : position;

  return (
    <div
      ref={triggerRef}
      className="relative inline-block group"
      onMouseEnter={trigger === "hover" ? showTooltip : undefined}
      onMouseLeave={trigger === "hover" ? hideTooltip : undefined}
      onFocus={trigger === "focus" ? showTooltip : undefined}
      onBlur={trigger === "focus" ? hideTooltip : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <span
        tabIndex={disabled ? -1 : 0}
        aria-describedby={isVisible ? "tooltip" : undefined}
        className="inline-flex"
      >
        {children}
      </span>

      {isVisible && (
        <div
          ref={tooltipRef}
          id="tooltip"
          role="tooltip"
          className={clsx(
            getPositionStyles(currentPosition),
            variantStyles[variant],
            "rounded-lg px-3 py-2 text-xs font-montserrat font-medium leading-tight text-justify",
            "shadow-lg border backdrop-blur-sm",
            "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
            "animate-in fade-in-0 zoom-in-95 duration-200",
            `delay-[${delay}ms]`,
            className,
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
