import { Card, Label, LoadingField } from "@/components";
import clsx from "clsx";

export default function SingleValueCard({
  label,
  value,
  isLoading,
  className,
}: {
  label: string;
  value: string;
  isLoading: boolean;
  className?: string;
}) {
  return (
    <Card variant="fund" className="flex-1 max-w-full min-w-[320px] !my-2 hover:border-primary">
      <Label label={label} className="domain-subtitle !justify-center" />
      {isLoading ? (
        <div className="flex justify-center mt-4 mb-1">
          <LoadingField className="!h-6 !w-48" />
        </div>
      ) : (
        <Label label={value} className={clsx("domain-title !justify-center mt-2", className)} />
      )}
    </Card>
  );
}
