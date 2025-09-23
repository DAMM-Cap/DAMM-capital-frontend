import daisyui from "daisyui";
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "475px",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        neutral: "var(--color-neutral)",
        disabled: "var(--color-disabled)",
        disabledDark: "var(--color-disabled-dark)",
        textDark: "var(--color-text-dark)",
        textLight: "var(--color-text-light)",
        textMuted: "var(--color-text-muted)",
        inputTxtDisabled: "var(--color-input-txt-disabled)",
        invalid: "var(--color-invalid)",
        success: "var(--color-success)",
        linkHover: "var(--color-link-hover)",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        slideUp: "slideUp 0.3s ease-out",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["dark"],
  },
} satisfies Config;
