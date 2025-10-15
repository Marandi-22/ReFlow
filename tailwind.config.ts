import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'industrial-bg': '#1a1a1a',
        'industrial-card': '#252525',
        'industrial-border': '#333333',
        'status-green': '#00ff00',
        'status-yellow': '#ffaa00',
        'status-red': '#ff0000',
        'status-blue': '#00aaff',
        'terminal-green': '#00ff00',
      },
    },
  },
  plugins: [],
};

export default config;
