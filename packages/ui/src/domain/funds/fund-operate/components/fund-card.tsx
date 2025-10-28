import { Button, Card, DammStableIcon, Table } from "@/components";
import { useIsMobile } from "@/components/hooks/use-is-mobile";
import { getVaultLinks } from "@/shared/config/link-utils";
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
  const isMobile = useIsMobile();
  
  try {
    const { vault_name, sharpe, netApy, netApy30d, aum, nav, vault_address } = useFundData();
    const {octavLink, curateLink} = getVaultLinks(vault_address!);
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
                        className="h-4 w-auto ml-2 mr-2 hover:cursor-pointer"
                        onClick={() => {
                          window.open(curateLink, "_blank");
                        }}
                      />
                      Verified by Kleros Curate.
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => {
                  window.open(octavLink, "_blank");
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
                { label: "Net APY", tooltip: "Since inception", className: "text-left" },
                { label: "30 days Net APY", className: "text-left" },
                { label: "AUM", className: "text-left" },
                { label: "NAV", className: "text-left" },
              ]}
              isLoading={isLoading}
              rows={[
                {
                  rowFields: [
                    {
                      value: netApy.toString(),
                      className: "text-left text-primary",
                    },
                    {
                      value: netApy30d.toString(),
                      className: "text-left",
                    },
                    {
                      value: aum.toString(),
                      className: "text-left",
                    },
                    {
                      value: nav.toString(),
                      className: "text-left",
                    },
                  ],
                },
              ]}
            />
            <Table
              noColor
              initialCol2X={false}
              tableHeaders={[
                { label: "Sharpe Ratio", className: "text-left" },
                { label: "Chain", className: "text-left" },
                { label: "Settlement Frequency", className: "text-left" },
                { label: "", className: "text-left" },
              ]}
              className={clsx("", { "-mt-2": isMobile, "mt-6": !isMobile })}
              isLoading={isLoading}
              rows={[
                {
                  rowFields: [
                    {
                      value: sharpe.toString(),
                      className: "text-left",
                    },
                    {
                      value: "Optimism",
                      className: "text-left",
                    },
                    {
                      value: "Average: 48 hours",
                      className: "text-left",
                    },
                    {
                      value: "",
                      className: "text-left",
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
