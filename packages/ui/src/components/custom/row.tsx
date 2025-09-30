import clsx from "clsx";
import React from "react";
import { useIsMobile } from "../hooks/use-is-mobile";
import { LoadingField } from "../index";

const RowSkeleton: React.FC<{ className?: string; columns?: number }> = ({
  className,
  columns,
}) => {
  const isMobile = useIsMobile();

  const cols = Math.min(Math.max(columns ?? 5, 2), 5);

  return (
    <div
      className={clsx(
        "w-full border border-disabledDark hover:border-primary bg-disabled rounded-2xl p-3 transition-colors duration-200 cursor-pointer",
        className,
      )}
    >
      {/* Mobile Layout */}
      {false && isMobile && (
        <div className="block">
          {/* Top line mimicking first cell with icon + text */}
          <div className="flex items-center justify-center gap-3 mb-3 w-3/4 mx-auto">
            <LoadingField variant="rounded" />
            <LoadingField />
          </div>
          {/* Grid for remaining cells */}
          <div className={clsx("grid gap-2 gap-y-3 mt-5", `grid-cols-${cols}`)}>
            {Array.from({ length: cols }).map((_, i) => (
              <div
                key={i}
                className={clsx(
                  "col-span-1",
                  i === 0 ? "text-left" : i === cols - 1 ? "text-right" : "text-center",
                )}
              >
                <LoadingField className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      {
        /* !isMobile && */ <div
          className={clsx("grid gap-2 items-center h-12 !rounded w-full px-4", `grid-cols-${cols}`)}
        >
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="col-span-1 w-full">
              {i === 0 ? (
                <div className="flex items-center gap-3">
                  <LoadingField variant="rounded" />
                  <LoadingField />
                </div>
              ) : (
                <div className={clsx("w-full", i === cols - 1 ? "text-right" : "text-center")}>
                  <LoadingField />
                </div>
              )}
            </div>
          ))}
        </div>
      }
    </div>
  );
};

interface RowField {
  leftIcon?: React.ReactNode;
  value: string;
  subtitle?: string;
  className?: string;
}

export interface RowProps {
  rowFields: RowField[];
  className?: string;
  onClick?: () => void;
  isLoading?: boolean;
}

const Row: React.FC<RowProps> = ({ rowFields, className = "", onClick, isLoading = false }) => {
  const isMobile = useIsMobile();

  const clamped = Math.min(Math.max(rowFields.length, 2), 5);

  if (isLoading) {
    return <RowSkeleton className={className} columns={rowFields.length} />;
  }

  return (
    <div
      className={clsx(
        "w-full border border-disabledDark hover:border-primary bg-disabled rounded-2xl p-3 transition-colors duration-200 cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      {/* Mobile Layout only if rowFields.length > 2 */}
      {isMobile && rowFields.length > 2 && (
        <div className="block">
          {rowFields.map((field, index) => (
            <div className="flex items-center justify-center gap-3 mb-3" key={index}>
              <div className="flex-shrink-0 flex items-center justify-center">
                {React.isValidElement(field.leftIcon)
                  ? React.cloneElement(field.leftIcon as React.ReactElement<{ size?: number }>, {
                      size: 28,
                    })
                  : field.leftIcon}
              </div>
              <div className="text-center">
                <div
                  className={clsx(
                    "font-montserrat font-bold text-base leading-none text-textLight",
                    field.className,
                  )}
                >
                  {field.value}
                </div>
                {field.subtitle && (
                  <div
                    className={clsx(
                      "font-montserrat font-normal text-tiny leading-none text-textLight mt-1",
                      field.className,
                    )}
                  >
                    {field.subtitle}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Desktop Layout */}
      {!(isMobile && rowFields.length > 2) && (
        <div
          className={clsx(
            "grid gap-2 items-center h-12 !rounded w-full px-4",
            `grid-cols-${clamped}`,
          )}
        >
          {rowFields.map((field, index) => (
            <div className="col-span-1 w-full" key={index}>
              <div
                className={clsx(
                  "font-montserrat font-bold text-lg leading-none text-textLight",
                  field.className,
                )}
              >
                <div className="inline-flex items-center gap-2 mb-1">
                  {field.leftIcon && (
                    <div className="flex-shrink-0 flex items-center justify-center">
                      {React.isValidElement(field.leftIcon)
                        ? React.cloneElement(
                            field.leftIcon as React.ReactElement<{ size?: number }>,
                            { size: 32 },
                          )
                        : field.leftIcon}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <div className="font-montserrat font-bold text-lg leading-none text-textLight">
                      {field.value}
                    </div>
                    {field.subtitle && (
                      <div className="font-montserrat font-normal text-tiny leading-none text-textLight mt-1">
                        {field.subtitle}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Row;
