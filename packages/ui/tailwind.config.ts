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
        primary: "#A3E635",
        secondary: "#505050",
        accent: "#F7FEE7",
        neutral: "#BDBDBD", // hover
        disabled: "rgba(24,24,27,0.8)", // #18181BCC
        textDark: "#09090B",
        textLight: "#F7FEE7",
        textMuted: "#505050",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["dark"],
  },
} satisfies Config;
