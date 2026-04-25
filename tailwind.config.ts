import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-elevated": "rgb(var(--surface-elevated) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        lavender: "#8b7bff",
        indigo: "#5964ff",
        sky: "#54b8ff",
        teal: "#50c7b4",
        coral: "#ff8f85",
        pink: "#ff86c8",
      },
      boxShadow: {
        soft: "0 22px 70px -26px rgba(49, 63, 153, 0.35)",
        glow: "0 16px 45px -20px rgba(111, 127, 255, 0.45)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      backgroundImage: {
        mesh: "radial-gradient(circle at top left, rgba(139,123,255,0.22), transparent 35%), radial-gradient(circle at top right, rgba(84,184,255,0.18), transparent 32%), radial-gradient(circle at bottom center, rgba(255,143,133,0.16), transparent 38%)",
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        pulseSoft: "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.7", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.04)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
