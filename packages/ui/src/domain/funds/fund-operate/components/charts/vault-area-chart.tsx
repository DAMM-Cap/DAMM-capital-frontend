import { Card, Label, Select } from "@/components";
import { ChartDataType, ChartRangeTypes } from "@/services/api/types/snapshot";
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
  label,
  range,
  setRange,
}: {
  data: ChartDataType[string];
  valueKey: string;
  label: string;
  range: ChartRangeTypes;
  setRange: (range: ChartRangeTypes) => void;
}) => {
  return (
    <Card variant="fund" className="!max-w-full min-w-0">
      <div className="flex items-center justify-between">
        <Label label={label} className="domain-title mb-2" />
        <Select
          className="scale-75 -mt-4 min-w-[100px]"
          value={range}
          onChange={(e) => setRange(e.target.value as ChartRangeTypes)}
          label="Range"
          children={viewOptions.map((option) => (
            <option key={option.id} value={option.id} label={option.label}>
              {option.label}
            </option>
          ))}
        />
      </div>
      <ViewToggle
        views={viewOptions}
        activeView={range}
        onViewChange={(viewId) => setRange(viewId as ChartRangeTypes)}
        className="mb-2"
      />

      <div className="max-w-full">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid opacity={0.1} />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent className="bg-disabled" />} />
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
    </Card>
  );
};

export default VaultAreaChart;
