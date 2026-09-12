import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Named "cs-*" to match CitySpak's own convention, but these are
        // this site's own fixed dark-theme values, not the app's tokens.
        "cs-bg": "var(--bg)",
        "cs-surface": "var(--surface)",
        "cs-surface-hi": "var(--surface-hi)",
        "cs-border": "var(--border)",
        "cs-green": "var(--green)",
        "cs-green-dim": "var(--green-dim)",
        "cs-amber": "var(--amber)",
        "cs-blue": "var(--blue)",
        "cs-chalk": "var(--chalk)",
        "cs-chalk-dim": "var(--chalk-dim)",
        "cs-chalk-mute": "var(--chalk-mute)",
        "cs-red": "var(--red)",
      },
      borderRadius: {
        cs: "var(--radius)",
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        mono: ["var(--font-dm-mono)", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
