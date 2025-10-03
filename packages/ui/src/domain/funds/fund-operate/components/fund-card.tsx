import { Button, Card, DammStableIcon, Row, Table } from "@/components";
import { useSearch } from "@tanstack/react-router";
import clsx from "clsx";
import { ExternalLinkIcon } from "lucide-react";
import { useFundOperateData } from "../hooks/use-fund-operate-data";
import klerosCurateIcon from "/kleros-curate.svg";
import octavIcon from "/octav.svg";

export default function FundCard({ isLoading }: { isLoading: boolean }) {
  const { vaultId } = useSearch({ from: "/fund-operate/" });
  const { useFundData, isLoading: vaultLoading } = useFundOperateData(vaultId!);
  const vaultIcon = <DammStableIcon size={48} />;

  try {
    const { vault_name, apr, aprChange, tvl } = useFundData();
    return (
      !vaultLoading && (
        <div className="flex-1 flex-col gap-4">
          <Card variant="fund">
            <div className="flex flex-wrap justify-between mb-4">
              <div className="inline-flex items-center gap-2 mb-8">
                <div className="flex-shrink-0 flex items-center justify-center">{vaultIcon}</div>
                <div className="flex flex-col">
                  <div
                    className={clsx(
                      "font-montserrat leading-none text-left font-bold domain-title",
                    )}
                  >
                    {vault_name}
                  </div>
                  <div className="font-montserrat font-normal text-tiny leading-none text-textLight mt-1">
                    <div className="flex items-center">
                      Managed by DAMM Capital.
                      <img
                        src={klerosCurateIcon}
                        alt={klerosCurateIcon}
                        className="h-4 w-auto ml-2 mr-2"
                        onClick={() => {
                          window.open("https://curate.kleros.io", "_blank");
                        }}
                      />
                      Verified by Kleros Curate.
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => {
                  window.open("https://octav.fi", "_blank");
                }}
                className="flex-1 !h-10 !min-w-40 !max-w-40  !bg-disabled !border-disabled !text-neutral !text-xs !border !border-neutral"
              >
                <img src={octavIcon} alt={octavIcon} className="h-4 w-auto -ml-12" />
                View on Octav
                <ExternalLinkIcon size={16} className="-mr-12" />
              </Button>
            </div>
            <Table
              noColor
              initialCol2X={false}
              tableHeaders={[
                { label: "Net APY", className: "text-center" },
                { label: "30 days Net APY", className: "text-center" },
                { label: "AUM", className: "text-center" },
                { label: "NAV", className: "text-center" },
              ]}
            >
              <Row
                isLoading={isLoading}
                rowFields={[
                  {
                    value: apr.toString(),
                    className: "text-center text-primary",
                  },
                  {
                    value: aprChange.toString(),
                    className: "text-center",
                  },
                  {
                    value: tvl.toString(),
                    className: "text-center",
                  },
                  {
                    value: tvl.toString(),
                    className: "text-center",
                  },
                ]}
              />
            </Table>
            <Table
              noColor
              initialCol2X={false}
              tableHeaders={[
                { label: "Sharp Ratio", className: "text-center" },
                { label: "Chain", className: "text-center" },
                { label: "Settlement Frequency", className: "text-center" },
                { label: "", className: "text-right" },
              ]}
            >
              <Row
                isLoading={isLoading}
                rowFields={[
                  {
                    value: apr.toString(),
                    className: "text-center",
                  },
                  {
                    value: "Optimism",
                    className: "text-center",
                  },
                  {
                    value: "Average: 48 hours",
                    className: "text-center",
                  },
                  {
                    value: "",
                    className: "text-center",
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
