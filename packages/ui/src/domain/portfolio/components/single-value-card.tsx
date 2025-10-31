import { Card, Label, LoadingField } from "@/components";
import clsx from "clsx";

export default function SingleValueCard({
  label,
  value,
  isLoading,
  className,
  isUSD,
}: {
  label: string;
  value: string;
  isLoading: boolean;
  className?: string;
  isUSD?: boolean;
}) {
  return (
    <Card variant="fund" className="flex-1 max-w-full min-w-[300px] !my-2">
      <Label label={label} className="domain-subtitle !justify-center" />
      {isLoading ? (
        <div className="flex justify-center mt-4 mb-1">
          <LoadingField className="!h-6 !w-48" />
        </div>
      ) : (
        <Label
          label={isUSD ? `≈ $${value} USD` : value}
          className={clsx("domain-title !justify-center mt-2", className)}
        />
      )}
    </Card>
  );
}
