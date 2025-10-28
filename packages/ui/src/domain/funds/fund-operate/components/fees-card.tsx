import { Card, Label, Table } from "@/components";
import { useIsMobile } from "@/components/hooks/use-is-mobile";
import { FundData } from "../hooks/use-fund-operate-data";

export default function FeesCard({
  isLoading,
  fundData,
}: {
  isLoading: boolean;
  fundData: FundData;
}) {
  const isMobile = useIsMobile();

  const { token_symbol, managementFee, performanceFee, entranceRate, exitRate } = fundData;

  return (
    <div className="flex-1 flex-col gap-4 max-w-full">
      <Card variant="fund">
        <Label label="Fees" className="domain-title mb-[0.5rem]" />
        <Table
          initialCol2X={false}
          noColor
          tableHeaders={[
            { label: isMobile ? "Mgmt. Fee" : "Management Fee", className: "text-center" },
            { label: isMobile ? "Perf. Fee" : "Performance Fee", className: "text-center" },
            { label: "Entry Rate", className: "text-center" },
            { label: "Exit Rate", className: "text-center" },
          ]}
          isLoading={isLoading}
          rows={[
            {
              rowFields: [
                {
                  value: managementFee.toString() + " " + token_symbol,
                  className: "text-center font-bold text-lg",
                },
                {
                  value: performanceFee.toString() + " " + token_symbol,
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
