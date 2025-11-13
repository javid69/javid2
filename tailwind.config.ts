import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0A2463",
          foreground: "#FFFFFF",
          50: "#E6EBF5",
          100: "#CCD7EB",
          200: "#99AFD7",
          300: "#6687C3",
          400: "#335FAF",
          500: "#0A2463",
          600: "#081D50",
          700: "#06163C",
          800: "#040F28",
          900: "#020714",
        },
        secondary: {
          DEFAULT: "#D4AF37",
          foreground: "#0A2463",
          50: "#FAF7EC",
          100: "#F5EFD9",
          200: "#EBDFB3",
          300: "#E1CF8D",
          400: "#D7BF67",
          500: "#D4AF37",
          600: "#AA8C2C",
          700: "#7F6921",
          800: "#554616",
          900: "#2A230B",
        },
        accent: {
          DEFAULT: "#247BA0",
          foreground: "#FFFFFF",
          50: "#E9F3F7",
          100: "#D3E7EF",
          200: "#A7CFDF",
          300: "#7BB7CF",
          400: "#4F9FBF",
          500: "#247BA0",
          600: "#1D6280",
          700: "#164A60",
          800: "#0E3140",
          900: "#071920",
        },
        background: {
          DEFAULT: "#F8F9FA",
          dark: "#0A0A0A",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
