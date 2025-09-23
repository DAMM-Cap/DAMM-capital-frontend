import clsx from "clsx";
import { XIcon as CloseIcon } from "lucide-react";
import React from "react";

export default function Modal({
  title,
  icon,
  statusIcon,
  open,
  onClose,
  children,
  className,
  actions,
}: {
  title: string;
  icon?: React.ReactNode;
  statusIcon?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  actions?: () => React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50"
      onClick={onClose}
    >
      <div
        className={clsx(
          "rounded-t-2xl p-6 w-full max-w-2xl mx-4 border overflow-hidden \
          bg-textDark border-secondary animate-slideUp",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            {icon && <div className="mr-4">{icon}</div>}
            <h3 className="font-montserrat font-bold text-2xl leading-none text-textLight">
              {title}
            </h3>
            {statusIcon && <div className="ml-4">{statusIcon}</div>}
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 bg-transparent border-0 outline-none hover:outline-none focus:outline-none active:outline-none group"
          >
            <CloseIcon className="w-5 h-5 transition-all stroke-[1] group-hover:stroke-[2]" />
          </button>
        </div>
        <div className="space-y-4 overflow-y-auto max-h-[60vh]">
          {children}
          {actions && <div className="flex space-x-3">{actions()}</div>}
        </div>
      </div>
    </div>
  );
}
