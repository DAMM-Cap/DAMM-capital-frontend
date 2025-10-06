import { Button, Card, DammStableIcon, Label, LoadingField, Table } from "@/components";
import { ButtonVariant } from "@/components/core/button";
import { useIsMobile } from "@/components/hooks/use-is-mobile";
import Deposit from "@/domain/funds/fund-operate/deposit";
import Withdraw from "@/domain/funds/fund-operate/withdraw";
import clsx from "clsx";
import { usePortfolioData } from "../hooks/use-portfolio-data";
import klerosCurateIcon from "/kleros-curate.svg";

export default function FundCard({
  isLoading,
  handleIsLoading,
  vaultId,
}: {
  isLoading: boolean;
  handleIsLoading: (isLoading: boolean) => void;
  vaultId: string;
}) {
  const { useFundData, isLoading: vaultLoading } = usePortfolioData(vaultId!);
  const vaultIcon = <DammStableIcon size={48} />;
  const isMobile = useIsMobile();

  try {
    const {
      vault_name,
      apr,
      positionSize,
      yieldEarned,
      vault_icon,
      token_symbol,
      operation,
      operationVariant,
    } = useFundData();
    return (
      !vaultLoading && (
        <div className="flex-1 flex-col gap-4">
          <Card variant="fund" className="hover:border-primary">
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
                          window.open("https://curate.kleros.io", "_blank");
                        }}
                      />
                      Verified by Kleros Curate.
                    </div>
                  </div>
                </div>
              </div>
              {!isMobile && (
                <div className="flex flex-row gap-4">
                  <Deposit
                    vaultId={vaultId!}
                    handleLoading={() => {}}
                    className="!h-10 !min-w-40 !max-w-40"
                  />
                  <Withdraw
                    vaultId={vaultId!}
                    handleLoading={() => {}}
                    className="!h-10 !min-w-40 !max-w-40"
                  />
                </div>
              )}
            </div>
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div className={clsx(isMobile ? "w-full" : "flex-1 min-w-[320px] max-w-full")}>
                <Table
                  noColor
                  initialCol2X={false}
                  tableHeaders={[
                    { label: "Position Size", className: "text-center" },
                    { label: "Yield Earned", className: "text-center" },
                    { label: "Net APY", className: "text-center" },
                    { label: "Underlying Asset", className: "text-center" },
                  ]}
                  isLoading={isLoading}
                  rows={[
                    {
                      rowFields: [
                        {
                          value: positionSize.toString(),
                          className: "text-center text-lg font-bold",
                        },
                        {
                          value: yieldEarned.toString(),
                          className: "text-center text-primary text-lg font-bold",
                        },
                        {
                          value: apr.toString(),
                          className: "text-center text-lg font-bold",
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
                          className: "text-center",
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
                  <Button
                    variant={operationVariant as ButtonVariant}
                    className={clsx("!h-8 text-sm", isMobile ? "w-full" : "!max-w-40")}
                  >
                    {operation}
                  </Button>
                )}
                {isMobile && (
                  <div className="flex flex-row gap-4 mt-8">
                    <Deposit
                      vaultId={vaultId!}
                      handleLoading={handleIsLoading}
                      className="w-full !h-10"
                    />
                    <Withdraw
                      vaultId={vaultId!}
                      handleLoading={handleIsLoading}
                      className="w-full !h-10"
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return <div>Error: {message}</div>;
  }
}
