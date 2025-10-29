import { Button, Card, DammStableIcon, Label, LoadingField, Table } from "@/components";
import { ButtonVariant } from "@/components/core/button";
import { useIsMobile } from "@/components/hooks/use-is-mobile";
import { getVaultLinks } from "@/shared/config/link-utils";
import { useNavigate } from "@tanstack/react-router";
import clsx from "clsx";
import { usePortfolioData } from "../hooks/use-portfolio-data";
import klerosCurateIcon from "/kleros-curate.svg";

export default function FundCard({ isLoading, vaultId }: { isLoading: boolean; vaultId: string }) {
  const { getFundData, isLoading: vaultLoading } = usePortfolioData(vaultId!);
  const vaultIcon = <DammStableIcon size={48} />;
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const {
    vault_name,
    apr,
    positionSize,
    yieldEarned,
    totalAssets,
    vault_icon,
    token_symbol,
    operation,
    operationVariant,
    operationActive,
    lastUpdate,
    vault_address,
  } = getFundData();

  const { curateLink } = getVaultLinks(vault_address!);

  return (
    !vaultLoading &&
    (Number(positionSize) > 0 || operationActive) && (
      <div
        className="flex-1 flex-col gap-4 hover:cursor-pointer"
        onClick={() => {
          navigate({ to: `/fund-operate?vaultId=${vaultId}` });
        }}
      >
        <Card variant="fund" className="hover:border-primary">
          <div className="flex flex-wrap justify-between mb-4">
            <div className="inline-flex items-center gap-2 mb-8">
              <div className="flex-shrink-0 flex items-center justify-center">{vaultIcon}</div>
              <div className="flex flex-col">
                <div
                  className={clsx("font-montserrat leading-none text-left font-bold domain-title")}
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
          </div>
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className={clsx(isMobile ? "w-full" : "flex-1 min-w-[320px] max-w-full")}>
              <Table
                noColor
                initialCol2X={false}
                tableHeaders={[
                  { label: "Position Size", className: "text-left" },
                  { label: "Yield Earned", className: "text-left" },
                  {
                    label: "Total Deposited",
                    className: "text-left",
                    tooltip: "Last update: " + new Date(lastUpdate ?? "").toLocaleString(),
                    tooltipClassName: "min-w-[240px]",
                  },
                  { label: "Net APY", className: "text-left" },
                  { label: "Underlying Asset", className: "text-left" },
                ]}
                isLoading={isLoading}
                rows={[
                  {
                    rowFields: [
                      {
                        value: positionSize.toString(),
                        className: "text-left text-lg font-bold",
                      },
                      {
                        value: yieldEarned.toString(),
                        className: "text-left text-primary text-lg font-bold",
                      },
                      {
                        value: totalAssets.toString(),
                        className: "text-left text-primary text-lg font-bold",
                      },
                      {
                        value: apr.toString(),
                        className: "text-left text-lg font-bold",
                      },
                      {
                        leftIcon: () =>
                          !vault_icon ? null : (
                            <img
                              src={vault_icon}
                              alt={vault_name}
                              className="w-5 h-5 object-cover rounded-full"
                            />
                          ),

                        value: token_symbol,
                        className: "text-left",
                      },
                    ],
                  },
                ]}
              />
            </div>

            <div
              className={clsx(
                "flex flex-col gap-4",
                isMobile ? "w-full order-last" : "flex-none min-w-[160px] w-auto self-start",
              )}
            >
              <Label label="Operation" className="text-center" />
              {isLoading ? (
                <LoadingField className="!h-8" />
              ) : (
                <Button variant={operationVariant as ButtonVariant} className={"!h-8 text-sm"}>
                  {operation}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    )
  );
}
