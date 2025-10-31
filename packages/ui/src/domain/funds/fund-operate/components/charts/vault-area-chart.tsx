import { Card, Label, LoadingField, Select } from "@/components";
import { useIsMobile } from "@/components/hooks/use-is-mobile";
import { ChartDataType, ChartRangeTypes } from "@/services/api/types/snapshot";
import { formatToMaxDefinition } from "@/shared/utils";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./shadcn/chart";
import ViewToggle from "./view-toggle";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--color-primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

const viewOptions: { id: ChartRangeTypes; label: string }[] = [
  {
    id: "24h",
    label: "Daily",
  },
  {
    id: "7d",
    label: "Weekly",
  },
  {
    id: "1m",
    label: "Monthly",
  },
  {
    id: "6m",
    label: "6 Months",
  },
  {
    id: "1y",
    label: "Annual",
  },
  {
    id: "all",
    label: "All Time",
  },
];

const VaultAreaChart = ({
  data,
  valueKey,
  valueLabel,
  valueUnit,
  label,
  range,
  setRange,
  isLoading,
}: {
  data: ChartDataType[string];
  valueKey: string;
  valueLabel: string;
  valueUnit: string;
  label: string;
  range: ChartRangeTypes;
  setRange: (range: ChartRangeTypes) => void;
  isLoading: boolean;
}) => {
  const isMobile = useIsMobile();
  return (
    <Card variant="fund" className="!max-w-full min-w-0">
      <div className="flex flex-col">
      <Label label={label} className="domain-title mb-2" />
      {!isLoading && isMobile && (
        <Select 
          label="" 
          value={range} 
          onChange={(value) => setRange(value.target.value as ChartRangeTypes)} 
          className="mb-2"
        >
          {viewOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </Select>
      )}
      </div>
      {!isLoading && !isMobile && (
        <ViewToggle
          views={viewOptions}
          activeView={range}
          onViewChange={(viewId) => setRange(viewId as ChartRangeTypes)}
          className="mb-2"
        />
      )}

      {!isLoading ? (
        <div className="max-w-full">
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid opacity={0.1} />
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  data.find((entry) => entry.date === value)?.dateLabel || value
                }
              />
              <YAxis />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      data.find((entry) => entry.date === value)?.dateLabel || value
                    }
                    className="bg-disabled"
                    formatter={(value) => {
                      return (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{valueLabel}:</span>
                          <span>
                            {formatToMaxDefinition(value)} {valueUnit}
                          </span>
                        </div>
                      );
                    }}
                  />
                }
              />
              <Area
                type="monotoneX"
                dataKey={valueKey}
                strokeWidth={2}
                strokeOpacity={0.8}
                fillOpacity={0.2}
                stroke="var(--color-primary)"
                fill="var(--color-primary)"
              />
            </AreaChart>
          </ChartContainer>
        </div>
      ) : (
        <LoadingField className="!h-[200px] w-full" />
      )}
    </Card>
  );
};

export default VaultAreaChart;
