import { Button } from "@/components";
import clsx from "clsx";
import React from "react";

interface ViewToggleProps {
  views: {
    id: string;
    label: string;
    icon?: React.ReactNode;
  }[];
  activeView: string;
  onViewChange: (viewId: string) => void;
  className?: string;
}

export default function ViewToggle({
  views,
  activeView,
  onViewChange,
  className = "",
}: ViewToggleProps) {
  return (
    <div className={clsx("flex", className)}>
      {views.map((view) => (
        <Button
          key={view.id}
          onClick={() => onViewChange(view.id)}
          variant="secondary"
          className={clsx("flex items-center h-6 text-xs transition-all duration-200", {
            "!bg-disabled !border-none": activeView !== view.id,
          })}
        >
          {view.icon && <span className="w-4 h-4">{view.icon}</span>}
          {view.label}
        </Button>
      ))}
    </div>
  );
}
