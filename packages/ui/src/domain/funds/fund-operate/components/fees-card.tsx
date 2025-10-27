import { Card, Label, Table } from "@/components";
import { useIsMobile } from "@/components/hooks/use-is-mobile";
import { useSearch } from "@tanstack/react-router";
import clsx from "clsx";
import { useFundOperateData } from "../hooks/use-fund-operate-data";

export default function FeesCard({ isLoading }: { isLoading: boolean }) {
  const { vaultId } = useSearch({ from: "/fund-operate/" });
  const { useFundData, isLoading: vaultLoading } = useFundOperateData(vaultId!);
  const isMobile = useIsMobile();
  try {
    const { token_symbol, managementFee, performanceFee, entranceRate, exitRate } = useFundData();

    return (
      !vaultLoading && (
        <div className="flex-1 flex-col gap-4 max-w-full">
          <Card variant="fund">
            <Label label="Fees" className="domain-title mb-[0.5rem]" />
            <Table
              initialCol2X={false}
              noColor
              tableHeaders={[
                { label: clsx(isMobile ? "Mgmt. Fee": "Management Fee"), className: "text-center" },
                { label: clsx(isMobile ? "Perf. Fee": "Performance Fee"), className: "text-center" },
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
      )
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return <div>Error: {message}</div>;
  }
}
