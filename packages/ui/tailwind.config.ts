import daisyui from "daisyui";
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        neutral: "var(--color-neutral)",
        disabled: "var(--color-disabled)",
        textDark: "var(--color-text-dark)",
        textLight: "var(--color-text-light)",
        textMuted: "var(--color-text-muted)",
        inputTxtDisabled: "var(--color-input-txt-disabled)",
        invalid: "var(--color-invalid)",
        success: "var(--color-success)",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["dark"],
  },
} satisfies Config;
