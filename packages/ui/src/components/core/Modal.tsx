import clsx from "clsx";
import React, { ComponentType, ReactElement } from "react";
import CloseIcon from "../icons/CloseIcon";

export const ModalContents = ({ children }: { children: React.ReactNode }) => <>{children}</>;
ModalContents.displayName = "ModalContents";

export const ModalActionButtons = ({ children }: { children: React.ReactNode }) => {
  const childrenArray = React.Children.toArray(children);
  const buttonCount = childrenArray.length;

  const getAutoWidth = (count: number) => {
    switch (count) {
      case 1:
        return "w-full";
      case 2:
        return "w-1/2";
      case 3:
        return "w-1/3";
      case 4:
        return "w-1/4";
      case 5:
        return "w-1/5";
      default:
        return "flex-1";
    }
  };

  return (
    <div className="flex flex-row w-full gap-3">
      {React.Children.map(children, (child) => {
        if (
          React.isValidElement(child) &&
          typeof child.props === "object" &&
          child.props !== null
        ) {
          const props = child.props as { className?: string };
          // If child has custom width, use it; otherwise apply automatic width
          const hasCustomWidth = props.className && props.className.includes("w-");

          if (hasCustomWidth) {
            // Keep the existing className as-is for custom widths
            return child;
          } else {
            // Apply automatic width for buttons without custom widths
            const autoWidth = getAutoWidth(buttonCount);
            const finalClassName = `${props.className || ""} ${autoWidth}`.trim();

            return React.cloneElement(child as React.ReactElement<any>, {
              ...props,
              className: finalClassName,
            });
          }
        }
        return child;
      })}
    </div>
  );
};
ModalActionButtons.displayName = "ModalActionButtons";

type ModalChildren = [
  React.ReactElement<typeof ModalContents>,
  React.ReactElement<typeof ModalActionButtons>,
];

export default function Modal({
  title,
  icon,
  statusIcon,
  open,
  onClose,
  children,
  className,
}: {
  title: string;
  icon?: React.ReactNode;
  statusIcon?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  children: ModalChildren;
  className?: string;
}) {
  let contents: ReactElement | null = null;
  let actions: ReactElement | null = null;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    const type = child.type;
    if (
      typeof type === "function" &&
      (type as ComponentType & { displayName?: string }).displayName === ModalContents.displayName
    ) {
      contents = child;
    } else if (
      typeof type === "function" &&
      (type as ComponentType & { displayName?: string }).displayName ===
        ModalActionButtons.displayName
    ) {
      actions = child;
    } else {
      throw new Error("Modal only accepts ModalContents and ModalActionButtons as children.");
    }
  });

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
          {contents}
          <div className="flex space-x-3">{actions}</div>
        </div>
      </div>
    </div>
  );
}
