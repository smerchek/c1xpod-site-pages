import type { Config } from "tailwindcss";
import typographyPlugin from "@tailwindcss/typography";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Satoshi", ...defaultTheme.fontFamily.sans],
      },
      spacing: {
        18: "4.5rem",
        112: "28rem",
        120: "30rem",
      },
    },
  },
  plugins: [typographyPlugin],
} satisfies Config;
