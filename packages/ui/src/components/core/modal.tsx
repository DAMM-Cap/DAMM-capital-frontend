import clsx from "clsx";
import { XIcon as CloseIcon } from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";

export default function Modal({
  title,
  icon,
  statusIcon,
  open,
  onClose,
  children,
  className,
  actions,
  blockClose,
}: {
  title: string;
  icon?: React.ReactNode;
  statusIcon?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  actions?: () => React.ReactNode;
  blockClose?: boolean;
}) {
  if (!open) return null;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-[9999] p-0 sm:p-4"
      onClick={blockClose ? undefined : onClose}
    >
      <div
        className={clsx(
          "rounded-t-2xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-2xl mx-0 sm:mx-4 border overflow-hidden \
          bg-textDark border-secondary animate-slideUp sm:animate-none",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <div className="flex items-center flex-1 min-w-0">
            {icon && <div className="mr-2 sm:mr-4 flex-shrink-0">{icon}</div>}
            <h3 className="font-montserrat font-bold text-lg sm:text-2xl leading-none text-textLight truncate">
              {title}
            </h3>
            {statusIcon && <div className="ml-2 sm:ml-4 flex-shrink-0">{statusIcon}</div>}
          </div>
          <button
            onClick={blockClose ? undefined : onClose}
            type="button"
            className="p-1 bg-transparent border-0 outline-none hover:outline-none focus:outline-none active:outline-none group flex-shrink-0 ml-2"
          >
            <CloseIcon className="w-5 h-5 transition-all stroke-[1] group-hover:stroke-[2]" />
          </button>
        </div>
        <div className="space-y-3 sm:space-y-4 overflow-y-auto max-h-[75vh] sm:max-h-[80vh]">
          {children}
          {actions && (
            <div className="flex flex-row space-x-2 sm:space-x-3 w-full">{actions()}</div>
          )}
        </div>
      </div>
    </div>
  );

  // Render modal in a portal to ensure it appears above all other content
  return createPortal(modalContent, document.body);
}
