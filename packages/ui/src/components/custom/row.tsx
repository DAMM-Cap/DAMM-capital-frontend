import clsx from "clsx";
import React from "react";
import { LoadingField } from "../index";
import { HeaderData } from "./table";

const RowSkeleton: React.FC<{
  className?: string;
  columns: number;
  gridColsClassName: string;
  isTableMobile?: boolean;
  initialCol2X?: boolean;
}> = ({ className, columns, gridColsClassName, isTableMobile, initialCol2X }) => {
  return (
    <div
      className={clsx(
        "w-full border border-disabledDark hover:border-primary bg-disabled rounded-2xl p-3 transition-colors duration-200 cursor-pointer",
        className,
      )}
    >
      {/* Mobile Layout */}
      {isTableMobile && (
        <div className="block">
          <div className={clsx("grid grid-cols-2 gap-2 w-full")}>
            {Array.from({ length: columns }).map((_, i) => (
              <div
                key={i}
                className={clsx("w-full", {
                  "col-span-2": i === 0 && initialCol2X,
                  "col-span-1": i > 0 || !initialCol2X,
                })}
              >
                <div className={clsx("flex flex-col items-center justify-center gap-3 mb-3")}>
                  {i > 0 && <LoadingField className="h-3 w-16 mb-1" />}
                  <div className="flex !flex-row items-center justify-center gap-3">
                    {i === 0 && initialCol2X && (
                      <>
                        <LoadingField variant="rounded" className="h-8 w-8" />
                        <LoadingField className="!h-5 !w-48" />
                      </>
                    )}
                    {(i > 0 || !initialCol2X) && <LoadingField className="h-4 w-16" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      {!isTableMobile && (
        <div
          className={clsx("grid gap-2 items-center h-12 !rounded w-full px-4", gridColsClassName)}
        >
          {Array.from({ length: columns }).map((_, i) => (
            <div
              key={i}
              className={clsx("w-full", i === 0 && initialCol2X ? "col-span-4" : "col-span-2")}
            >
              {i === 0 && initialCol2X ? (
                <div className="flex items-center gap-3">
                  <LoadingField variant="rounded" />
                  <LoadingField />
                </div>
              ) : (
                <div className={clsx("w-full", i === columns - 1 ? "text-right" : "text-center")}>
                  <LoadingField />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export interface RowField {
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
  isTableMobile?: boolean;
  gridColsClassName?: string;
  tableHeaders?: HeaderData[];
  initialCol2X?: boolean;
  noColor?: boolean;
}

const Row: React.FC<RowProps> = ({
  rowFields,
  className = "",
  onClick,
  isLoading = false,
  isTableMobile,
  gridColsClassName,
  tableHeaders,
  initialCol2X,
  noColor,
}) => {
  if (isLoading) {
    return (
      <RowSkeleton
        className={className}
        columns={rowFields.length}
        gridColsClassName={gridColsClassName || ""}
        isTableMobile={isTableMobile}
        initialCol2X={initialCol2X}
      />
    );
  }

  return (
    <div
      className={clsx(
        "w-full rounded-2xl p-3 transition-colors duration-200 cursor-pointer",
        { "border border-disabledDark hover:border-primary bg-disabled": !noColor },
        className,
      )}
      onClick={onClick}
    >
      {/* Mobile Layout only if isMobile and rowFields.length > 2 */}
      {isTableMobile && (
        <div className="block">
          <div className={clsx("grid grid-cols-2 gap-2 w-full")}>
            {rowFields.map((field, index) => (
              <div
                className={clsx("w-full", {
                  "col-span-2": index === 0 && initialCol2X,
                  "col-span-1": index > 0 || !initialCol2X,
                })}
                key={index}
              >
                <div className={clsx("flex flex-col items-center justify-center gap-3 mb-3")}>
                  {(index > 0 || !initialCol2X) && (
                    <div
                      className={clsx(
                        "font-montserrat font-normal leading-none text-neutral mb-1 text-center",
                        { "text-xs": !noColor, "text-sm": noColor },
                      )}
                    >
                      {tableHeaders![index].label}
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="flex-shrink-0 flex items-center justify-center">
                      {React.isValidElement(field.leftIcon)
                        ? React.cloneElement(
                            field.leftIcon as React.ReactElement<{ size?: number }>,
                            {
                              size: index === 0 && initialCol2X ? 32 : 28,
                            },
                          )
                        : field.leftIcon}
                    </div>
                    <div className="text-center">
                      <div className={clsx("font-montserrat leading-none", field.className)}>
                        {field.value}
                      </div>
                      {field.subtitle && (
                        <div
                          className={clsx(
                            "font-montserrat font-normal text-xs-sm leading-none text-textLight mt-1 text-center",
                            field.className,
                          )}
                        >
                          {field.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      {!isTableMobile && (
        <div
          className={clsx("grid gap-2 items-center h-12 !rounded w-full px-4", gridColsClassName)}
        >
          {rowFields.map((field, index) => (
            <div
              className={clsx(
                "col-span-1 w-full",
                index === 0 && initialCol2X ? "col-span-4" : "col-span-2",
              )}
              key={index}
            >
              <div
                className={clsx(
                  "font-montserrat leading-none text-textLight text-sm",
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
                    <div className={clsx("font-montserrat leading-none", field.className)}>
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
