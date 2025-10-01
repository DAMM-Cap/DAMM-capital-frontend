import {
  Breadcrumb,
  Card,
  DammStableIcon,
  InfoLabel,
  Label,
  Row,
  Table,
  TitleLabel,
} from "@/components";
import { useSearch } from "@tanstack/react-router";
import clsx from "clsx";
import { useState } from "react";
import Deposit from "./deposit";
import { useFundOperateData } from "./hooks/use-fund-operate-data";
import Withdraw from "./withdraw";

export default function FundOperate() {
  const { vaultId } = useSearch({ from: "/fund-operate/" });
  const { useFundData, isLoading: vaultLoading } = useFundOperateData(vaultId!);
  const [isLoading, setIsLoading] = useState(false);
  const vaultIcon = <DammStableIcon size={48} />;

  try {
    const {
      vault_name,
      vault_symbol,
      apr,
      aprChange,
      vault_icon,
      token_symbol,
      totalValue,
      vaultShare,
      claimableShares,
      tvl,
      managementFee,
      performanceFee,
      entranceRate,
      exitRate,
      walletBalance,
    } = useFundData();

    return (
      !vaultLoading && (
        <>
          <Breadcrumb vaultName={vault_name} className="-mt-8" />
          <div className="flex flex-wrap flex-1 justify-center max-w-full gap-4">
            <div className="flex-1 flex-col gap-4 max-w-[800px] min-w-[300px]">
              <Card variant="fund">
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
                      Managed by DAMM Capital. Verified by Kleros Curate.
                    </div>
                  </div>
                </div>
                <Table
                  noColor
                  initialCol2X={false}
                  tableHeaders={[
                    { label: "Net APY", className: "text-center" },
                    { label: "30 days Net APY", className: "text-center" },
                    { label: "AUM", className: "text-center" },
                    { label: "Underlying Asset", className: "text-right" },
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
                        leftIcon: (
                          <img
                            src={vault_icon}
                            alt={vault_name}
                            className="w-5 h-5 object-cover rounded-full"
                          />
                        ),
                        value: token_symbol,
                        className: "text-right",
                      },
                    ]}
                  />
                </Table>
              </Card>
            </div>

            <div className="max-w-[300px] max-w-[500px] flex-1">
              <Card variant="fund">
                <Label label="Manage position" className="domain-title mb-1" />
                <Label
                  label="Deposit or withdraw from the fund"
                  className="!text-sm text-neutral font-montserrat font-normal leading-none mb-4"
                />
                <TitleLabel title={totalValue} secondaryTitle={vaultShare} label="My position" />

                <TitleLabel
                  title={walletBalance.toString()}
                  label="My wallet balance"
                  className="!-mt-2"
                />

                <div className="flex flex-row gap-4">
                  <Deposit vaultId={vaultId!} handleLoading={setIsLoading} className="w-full" />
                  <Withdraw vaultId={vaultId!} handleLoading={setIsLoading} className="w-full" />
                </div>
              </Card>
            </div>

            <Card variant="fund" className="!max-w-full">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[400px]">
                  <Label label="Thesis" className="domain-title mb-2" />
                  <ul className="list-disc list-outside pl-1 text-sm text-neutral font-montserrat leading-snug break-words ml-4">
                    <li>Provide low-risk stable yield on popular USD stablecoins.</li>
                    <li>
                      Assets are invested in short-term unleveraged concentrated liquidity
                      positions.
                    </li>
                    <li>All underlying positions are always immediately liquidateable (t0).</li>
                  </ul>
                </div>
                <div className="flex-1 min-w-[400px]">
                  <Label label="Goal" className="domain-title mb-2" />
                  <ul className="list-disc list-outside pl-1 text-sm text-neutral font-montserrat leading-snug break-words ml-4">
                    <li>Provide low-risk stable yield on popular USD stablecoins.</li>
                    <li>
                      Assets are invested in short-term unleveraged concentrated liquidity
                      positions.
                    </li>
                    <li>All underlying positions are always immediately liquidateable (t0).</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card variant="fund" className="!max-w-full">
              <Label label="Overview" className="domain-title mb-2" />
              <InfoLabel>
                DAMMstable is a systematic, market-neutral fund designed to deliver the best
                risk-adjusted returns on USD-denominated stablecoins. It generates genuine yield
                without reliance on external incentives, investing exclusively in short-term,
                actively managed liquidity positions on Uniswap V3 and Aave V3. The strategy is
                entirely algorithmic, operating without leverage, and maintains exposure solely to
                blue-chip stablecoins -USDC, USDT, USDCe, and DAI- and to the protocols in which
                they are deployed. By combining disciplined execution with prudent asset selection,
                DAMMstable offers sophisticated investors stable, transparent, and repeatable
                returns with a strong emphasis on capital preservation.
              </InfoLabel>
            </Card>

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

            <Card variant="fund" className="!max-w-full">
              <Label label="Risk Disclosure" className="domain-title mb-2" />
              <InfoLabel>
                We always seek to minimize risk wherever possible; however, decentralized finance
                (DeFi) operates in a highly adversarial environment where protocols are frequently
                targeted for exploits and attacks. The following are key risks associated with the
                DAMM USD stablecoin Money Market Fund:
                <ol className="list-decimal list-inside pl-1 text-sm text-neutral font-montserrat leading-snug break-words">
                  <li className="mt-4">
                    Smart Contract Risks: Despite thorough due diligence, smart contracts can
                    contain undiscovered bugs or behave in unanticipated ways, resulting in assets
                    being frozen, lost, or exploited. This risk, inherent to the DeFi ecosystem,
                    could impact the stability and security of the fund's holdings.
                  </li>
                  <li className="mt-4">
                    Custodial and Multisig Risks: Assets within this fund are stored in a Gnosis
                    Safe Multisig wallet for added security, requiring multiple authorized
                    signatures for transactions. However, if all signers' private keys are
                    compromised, the entire asset pool could be at risk of loss.
                  </li>
                  <li className="mt-4">
                    Stablecoin Depeg Risks: While stablecoins are generally designed to maintain a
                    1-to-1 peg with the U.S. Dollar, temporary depegs can occur during periods of
                    market stress. Although many of these are resolved quickly, there is a risk of a
                    permanent depeg, which could lead to significant losses for the fund if the
                    stablecoin's value diverges from its intended dollar parity.
                  </li>
                </ol>
              </InfoLabel>
            </Card>
          </div>
        </>
      )
    );
  } catch (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col gap-4 w-full text-center">
          <Label label="Vault Not Found" className="domain-title mb-[0.5rem]" />
          <p className="text-textLight">The requested vault could not be found.</p>
        </div>
      </div>
    );
  }
}
