import type { Theme } from "@coinbase/cdp-react";

export const theme: Partial<Theme> = {
  // Background colors
  "colors-bg-default": "#09090B", // Main background
  "colors-bg-overlay": "#18181BCC", // Card background with transparency
  "colors-bg-skeleton": "#18181B", // Skeleton/loading background
  "colors-bg-primary": "#A3E635", // Primary accent (green)
  "colors-bg-secondary": "#18181B", // Secondary background

  // Foreground/text colors
  "colors-fg-default": "#F7FEE7", // Main text color
  "colors-fg-muted": "#BDBDBD", // Muted/secondary text
  "colors-fg-primary": "#A3E635", // Primary accent text
  "colors-fg-onPrimary": "#09090B", // Text on primary background
  "colors-fg-onSecondary": "#F7FEE7", // Text on secondary background

  // Border/line colors
  "colors-line-default": "#18181B", // Default borders
  "colors-line-heavy": "#BDBDBD", // Heavy borders
  "colors-line-primary": "#A3E635", // Primary accent borders

  // Typography
  "font-family-sans": "Montserrat, system-ui, sans-serif",
  "font-size-base": "14px",
};
