import { ChartDataType, ChartRangeTypes } from "@/services/api/types/snapshot";
import { useSnapshots } from "@/services/api/use-vault-snapshots";
import { getNetworkConfig } from "@/shared/config/network";
import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import VaultAreaChart from "./charts/vault-area-chart";

interface MetricsViewProps {
  vaultId: string;
  valueKey: string;
  valueLabel: string;
  label: string;
  valueUnit: string;
  isLoading: boolean;
}

export default function MetricsView({
  vaultId,
  valueKey,
  valueLabel,
  label,
  valueUnit,
  isLoading,
}: MetricsViewProps) {
  const network = getNetworkConfig();

  const [range, setRange] = useState<ChartRangeTypes>("1y");
  const [formattedChartData, setFormattedChartData] = useState<ChartDataType>({});

  const { data: chartData, isLoading: isLoadingSnapshots } = useSnapshots({
    chainId: network.chain.id,
    ranges: range,
    offset: 0,
    limit: 100,
  });

  useEffect(() => {
    console.log("chartData", chartData);
    if (!isLoadingSnapshots && !isLoading && chartData) {
      const reducedChartData: ChartDataType = chartData.reduce((acc, vaultData) => {
        const date = vaultData.event_timestamp;
        const totalAssetsValue = Number(
          formatUnits(BigInt(vaultData.total_assets), vaultData.deposit_token_decimals),
        );
        const sharePiceValue = vaultData.share_price * Math.pow(10, vaultData.vault_token_decimals - vaultData.deposit_token_decimals);
        const apyValue = vaultData.apy;
        const vaultId = vaultData.vault_id;

        if (!acc[vaultId]) {
          acc[vaultId] = [];
        }

        acc[vaultId].push({
          date,
          dateLabel: date,
          totalAssetsValue,
          sharePiceValue,
          apyValue,
          label: vaultData.deposit_token_symbol,
          metric: range === "24h" ? "hours" : "days",
        });
        return acc;
      }, {} as ChartDataType);

      Object.keys(reducedChartData).forEach((vaultId) => {
        reducedChartData[vaultId].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
      });

      Object.entries(reducedChartData).map(([vaultId]) => {
        reducedChartData[vaultId].forEach((d) => {
          let formattedDate;
          if (d.metric === "hours")
            formattedDate = new Date(d.date).toLocaleTimeString("en-US", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            });
          else
            formattedDate = new Date(d.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

          if (formattedDate !== "Invalid Date") d.dateLabel = formattedDate;

          return d;
        });
      });

      setFormattedChartData(reducedChartData);
    }
  }, [chartData, range, isLoading]);

  return (
    <VaultAreaChart
      data={formattedChartData[vaultId] || []}
      valueKey={valueKey}
      valueLabel={valueLabel}
      valueUnit={valueUnit}
      label={label}
      range={range}
      setRange={setRange}
      isLoading={isLoading}
    />
  );
}
