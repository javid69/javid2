import aspectRatio from "@tailwindcss/aspect-ratio";
import containerQueries from "@tailwindcss/container-queries";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "var(--space-md)",
        sm: "var(--space-lg)",
        lg: "var(--space-xl)",
        xl: "calc(var(--space-xl) + var(--space-2xs))",
        "2xl": "calc(var(--space-xl) + var(--space-sm))",
      },
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        background: {
          DEFAULT: "var(--color-background)",
          soft: "var(--color-background-soft)",
        },
        foreground: "var(--color-foreground)",
        border: "var(--color-border)",
        ring: "var(--color-ring)",
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          elevated: "var(--color-surface-elevated)",
          accent: "var(--color-surface-accent)",
          soft: "var(--color-surface-soft)",
        },
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
          subtle: "var(--color-primary-soft)",
          highlight: "var(--color-primary-highlight)",
          border: "var(--color-primary-border)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-accent-foreground)",
          glow: "var(--color-accent-glow)",
          soft: "var(--color-accent-soft)",
        },
        info: {
          DEFAULT: "var(--color-info)",
          foreground: "var(--color-info-foreground)",
        },
        success: {
          DEFAULT: "var(--color-success)",
          foreground: "var(--color-success-foreground)",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
          foreground: "var(--color-warning-foreground)",
        },
        danger: {
          DEFAULT: "var(--color-danger)",
          foreground: "var(--color-danger-foreground)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
        display: ["var(--font-display)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-mono)", ...defaultTheme.fontFamily.mono],
      },
      spacing: {
        "3xs": "var(--space-3xs)",
        "2xs": "var(--space-2xs)",
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        "3xl": "var(--space-3xl)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "9999px",
      },
      fontSize: {
        xs: ["var(--font-size-xs)", { lineHeight: "var(--line-height-xs)" }],
        sm: ["var(--font-size-sm)", { lineHeight: "var(--line-height-sm)" }],
        base: ["var(--font-size-base)", { lineHeight: "var(--line-height-base)" }],
        lg: ["var(--font-size-lg)", { lineHeight: "var(--line-height-lg)" }],
        xl: ["var(--font-size-xl)", { lineHeight: "var(--line-height-xl)" }],
        "2xl": ["var(--font-size-2xl)", { lineHeight: "var(--line-height-2xl)" }],
        "3xl": ["var(--font-size-3xl)", { lineHeight: "var(--line-height-3xl)" }],
        "4xl": ["var(--font-size-4xl)", { lineHeight: "var(--line-height-4xl)" }],
        "5xl": ["var(--font-size-5xl)", { lineHeight: "var(--line-height-5xl)" }],
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        glow: "var(--shadow-glow)",
      },
      transitionTimingFunction: {
        "yashvi-arc": "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      backgroundImage: {
        "grid-yashvi": "var(--gradient-grid)",
        "radial-yashvi": "var(--gradient-radial)",
      },
      maxWidth: {
        prose: "65ch",
      },
    },
  },
  plugins: [forms, typography, aspectRatio, containerQueries],
} satisfies Config;

export default config;
