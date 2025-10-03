import { Card, Label, Row, Table } from "@/components";
import { useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useFundOperateData } from "../hooks/use-fund-operate-data";

export default function FeesCard({
  handleLoading,
}: {
  handleLoading: (isLoading: boolean) => void;
}) {
  const { vaultId } = useSearch({ from: "/fund-operate/" });
  const { useFundData, isLoading: vaultLoading } = useFundOperateData(vaultId!);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(vaultLoading);
    handleLoading(isLoading);
  }, [isLoading]);

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
                { label: "Management Fee", className: "text-center" },
                { label: "Performance Fee", className: "text-center" },
                { label: "Entry Rate", className: "text-center" },
                { label: "Exit Rate", className: "text-center" },
              ]}
            >
              <Row
                isLoading={isLoading}
                rowFields={[
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
                ]}
              />
            </Table>
          </Card>
        </div>
      )
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return <div>Error: {message}</div>;
  }
}
