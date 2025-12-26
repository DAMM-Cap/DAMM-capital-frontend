import { Card, Label, Table } from "@/components";
import { useIsMobile } from "@/components/hooks/use-is-mobile";
import clsx from "clsx";
import { FundData } from "../hooks/use-fund-operate-data";

export default function FeesCard({
  fundData,
  isLoading,
}: {
  fundData: FundData;
  isLoading: boolean;
}) {
  const isMobile = useIsMobile();
  const { managementFee, performanceFee, entranceRate, exitRate } = fundData;

  return (
    <div className="flex-1 flex-col gap-4 max-w-full">
      <Card variant="fund">
        <Label label="Fees" className="domain-title mb-[0.5rem]" />
        <Table
          initialCol2X={false}
          noColor
          tableHeaders={[
            { label: clsx(isMobile ? "Mgmt. Fee" : "Management Fee"), className: "text-center" },
            { label: clsx(isMobile ? "Perf. Fee" : "Performance Fee"), className: "text-center" },
            { label: "Entry Rate", className: "text-center" },
            { label: "Exit Rate", className: "text-center" },
          ]}
          isLoading={isLoading}
          rows={[
            {
              rowFields: [
                {
                  value: managementFee.toString() + "%",
                  className: "text-center font-bold text-lg",
                },
                {
                  value: performanceFee.toString() + "%",
                  className: "text-center font-bold text-lg",
                },
                {
                  value: entranceRate.toString() + "%",
                  className: "text-center font-bold text-lg",
                },
                {
                  value: exitRate.toString() + "%",
                  className: "text-center font-bold text-lg",
                },
              ],
            },
          ]}
        />
      </Card>
    </div>
  );
}
