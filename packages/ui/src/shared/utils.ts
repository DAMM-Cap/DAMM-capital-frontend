import envParsed from "@/envParsed";

// Helper functions
/* const roundToDecimals = (value: number, decimals: number): number => {
  return parseFloat(value.toFixed(decimals));
}; */

function truncateToDecimals(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.trunc(num * factor) / factor;
}

export const formatToMaxDefinition = (value: number | undefined | null): number => {
  const maxDefinition = envParsed().MAX_DEFINITION;
  if (value === undefined || value === null || isNaN(value)) {
    return 0;
  }
  return truncateToDecimals(value, maxDefinition);
};

export const formatMetricValue = (
  value: number | undefined | null,
  suffix: string = "%"
): string => {
  if (value === undefined || value === null || value === 0) {
    return "—"; // em dash for not available
  }
  return `${value}${suffix}`;
};
