import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        muted: "#6b7280",
        line: "#ff6b00",
        amberline: "#f6b100",
        paper: "#fffdf8",
        warm: "#fff6e8"
      },
      boxShadow: {
        panel: "0 18px 60px rgba(17, 24, 39, 0.08)",
        control: "0 8px 22px rgba(255, 107, 0, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
