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
        pharmacy: {
          canvas: "#EDF5F3", // soft mint / pale cyan canvas
          canvasLight: "#F3F9F8",
          dark: "#0B2B28", // deep dark teal accent / active pill
          darkHover: "#133E3A",
          darkActive: "#07201E",
          surface: "#FFFFFF", // card surface
          mintLight: "#E3F5F0", // light mint badge / subtle bg
          mintHover: "#EAF5F2",
          salmon: "#FDECE8", // muted salmon/pink accent
          salmonText: "#E05A47",
          textPrimary: "#0D2C28", // deep dark teal primary text
          textSecondary: "#4D6B66", // muted teal secondary text
          textMuted: "#87A19D", // lighter gray-teal muted text / category headers
          border: "#E1ECE9", // subtle border
          borderLight: "#EEF5F3",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 10px 30px -5px rgba(11, 43, 40, 0.04), 0 4px 12px -2px rgba(11, 43, 40, 0.02)",
        pill: "0 4px 14px 0 rgba(11, 43, 40, 0.15)",
        search: "0 2px 10px rgba(11, 43, 40, 0.03)",
        floating: "0 20px 40px -15px rgba(11, 43, 40, 0.08)",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
