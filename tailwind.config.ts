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
        snaptrack: {
          light: "#D6F5D6",
          main: "#ACE4AA",
          dark: "#8AC78A",
          text: "#3A7D44",
        },
      },
    },
  },
  plugins: [],
};
export default config;
