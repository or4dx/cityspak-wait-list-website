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
        // rgb(var(--x) / <alpha-value>) lets opacity modifiers (bg-cs-accent/20)
        // work, matching the main app's tailwind.config.ts convention exactly.
        "cs-bg": "rgb(var(--cs-bg) / <alpha-value>)",
        "cs-surface": "rgb(var(--cs-surface) / <alpha-value>)",
        "cs-surface-elevated": "rgb(var(--cs-surface-elevated) / <alpha-value>)",
        "cs-accent": "rgb(var(--cs-accent) / <alpha-value>)",
        "cs-accent-hover": "rgb(var(--cs-accent-hover) / <alpha-value>)",
        "cs-warm": "rgb(var(--cs-warm) / <alpha-value>)",
        "cs-text": "rgb(var(--cs-text) / <alpha-value>)",
        "cs-text-muted": "rgb(var(--cs-text-muted) / <alpha-value>)",
        "cs-text-subtle": "rgb(var(--cs-text-subtle) / <alpha-value>)",
        "cs-border": "rgb(var(--cs-border) / var(--cs-border-opacity))",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
