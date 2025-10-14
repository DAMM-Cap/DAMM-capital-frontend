// Helper function to format numbers to 4 decimal places without trailing zeros
export const formatToFourDecimals = (value: number | undefined | null): number => {
  if (value === undefined || value === null || isNaN(value)) {
    return 0;
  }
  return parseFloat(value.toFixed(4));
};
