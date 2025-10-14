import { LoadingField, Select } from "@/components";
import { ChartDataType, ChartRangeTypes } from "@/services/api/types/snapshot";
import { useSnapshots } from "@/services/api/use-vault-snapshots";
import { getNetworkConfig } from "@/shared/config/network";
import { Suspense, useEffect, useState } from "react";
import { formatUnits } from "viem";
//import StackedAreaChart from "./area-chart";
import ChartCard from "./chart-card";

export default function MetricsView({ presentation }: { presentation?: boolean }) {
  const network = getNetworkConfig();

  const [filter, setFilter] = useState("all");
  const [range, setRange] = useState<ChartRangeTypes>("1m");
  const [dataFilter, setDataFilter] = useState<string>("total_assets");
  const [chartOptions, setChartOptions] = useState<string[]>([]);
  const [chartDisplayLabels, setChartDisplayLabels] = useState<Record<string, string>>({});
  const [formattedChartData, setFormattedChartData] = useState<ChartDataType>({});

  const { data: chartData /* , isLoading: isLoadingChart */ } = useSnapshots({
    chainId: Number(network.chain.id),
    ranges: range,
    offset: 0,
    limit: 80,
  });

  const formatChartData = () => {
    if (!chartData) return;

    const reducedChartData: ChartDataType = chartData.reduce((acc, vaultData) => {
      const date = vaultData.event_timestamp;
      const value =
        dataFilter === "total_assets"
          ? Number(formatUnits(BigInt(vaultData.total_assets), vaultData.deposit_token_decimals))
          : vaultData.apy;
      const vaultId = vaultData.vault_id;

      if (!acc[vaultId]) {
        acc[vaultId] = [];
      }

      acc[vaultId].push({
        date,
        value,
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

    const filteredData: ChartDataType =
      filter === "all"
        ? reducedChartData
        : {
            [filter]: reducedChartData[filter],
          };

    setFormattedChartData(filteredData);
  };

  useEffect(() => {
    if (chartData) {
      const chartOptions = chartData.reduce((acc, snapshot) => {
        if (!acc.includes(snapshot.vault_id)) {
          acc.push(snapshot.vault_id);
        }
        return acc;
      }, [] as string[]);
      chartOptions.unshift("all");

      const chartDisplayLabels = chartData.reduce(
        (acc, snapshot) => {
          acc[snapshot.vault_id] = snapshot.deposit_token_symbol;
          return acc;
        },
        {} as Record<string, string>,
      );
      chartDisplayLabels["all"] = "All Funds";

      setChartOptions(chartOptions);
      setChartDisplayLabels(chartDisplayLabels);
    }
  }, [chartData]);

  useEffect(() => {
    formatChartData();
  }, [chartData, filter, range, dataFilter]);

  return (
    <Suspense fallback={<LoadingField />}>
      <ChartCard
        variant="small"
        light
        selector={
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Select Property"
            children={chartOptions.map((option) => (
              <option key={option} value={option} label={chartDisplayLabels[option]}>
                {option}
              </option>
            ))}
            //options={chartOptions}
            //displayLabels={chartDisplayLabels}
            //size="small"
          />
        }
        onViewChange={(viewId) => setRange(viewId as ChartRangeTypes)}
        externalToggle={{
          externalToggleOptions: [
            {
              id: "total_assets",
              label: "TVL",
            },
            {
              id: "apy",
              label: "APY",
            },
          ],
          externalToggleDisplayLabels: {
            total_assets: "TVL",
            apy: "APY",
          },
          externalToggleValue: dataFilter,
          externalToggleOnChange: (value) => setDataFilter(value),
        }}
      >
        {/* <StackedAreaChart data={formattedChartData} /> */}
        TESTING
      </ChartCard>
    </Suspense>
  );
}
