/**
 * Tailwind CSS v4 Configuration
 *
 * NOTE: Tailwind v4 uses CSS-first configuration via @theme in globals.css.
 * This file serves as a reference/documentation of the design system tokens
 * and is used by the @config directive when JS-based config is needed.
 *
 * Agent 1 (UI Architect) Deliverable
 */
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "375px",
      md: "768px",
      lg: "1280px",
      xl: "1440px",
    },
    extend: {
      colors: {
        bg: {
          deep: "var(--bg-deep)",
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          elevated: "var(--bg-elevated)",
          surface: "var(--bg-surface)",
          hover: "var(--bg-hover)",
          glass: "var(--bg-glass)",
        },
        neon: {
          cyan: "var(--neon-cyan)",
          "cyan-dim": "var(--neon-cyan-dim)",
          purple: "var(--neon-purple)",
          "purple-dim": "var(--neon-purple-dim)",
          blue: "var(--neon-blue)",
          "blue-dim": "var(--neon-blue-dim)",
        },
        accent: {
          gold: "var(--accent-gold)",
          "gold-dim": "var(--accent-gold-dim)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
        info: "var(--info)",
      },
      fontFamily: {
        display: ["Orbitron", "system-ui", "sans-serif"],
        body: ["Inter", "Noto Sans SC", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0, 0, 0, 0.4)",
        md: "0 4px 12px rgba(0, 0, 0, 0.5)",
        lg: "0 8px 30px rgba(0, 0, 0, 0.6)",
        xl: "0 16px 50px rgba(0, 0, 0, 0.7)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        "glow-cyan-sm": "0 0 10px rgba(0, 229, 255, 0.35)",
        "glow-cyan-md": "0 0 20px rgba(0, 229, 255, 0.35), 0 0 40px rgba(0, 229, 255, 0.15)",
        "glow-cyan-lg": "0 0 30px rgba(0, 229, 255, 0.35), 0 0 60px rgba(0, 229, 255, 0.12), 0 0 100px rgba(0, 229, 255, 0.06)",
        "glow-purple-sm": "0 0 10px rgba(180, 74, 255, 0.30)",
        "glow-purple-md": "0 0 20px rgba(180, 74, 255, 0.30), 0 0 40px rgba(180, 74, 255, 0.12)",
        "glow-gold-sm": "0 0 10px rgba(240, 180, 41, 0.30)",
        "glow-gold-md": "0 0 20px rgba(240, 180, 41, 0.30), 0 0 40px rgba(240, 180, 41, 0.12)",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "slide-in-right": "slide-in-right 0.4s ease-out forwards",
        "scale-in": "scale-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        marquee: "marquee 30s linear infinite",
        "typing-dot": "typing-dot 1.4s ease-in-out infinite",
        shimmer: "shimmer 1.5s ease-in-out infinite",
      },
      transitionTimingFunction: {
        snappy: "cubic-bezier(0.25, 0.8, 0.25, 1)",
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
    },
  },
  plugins: [],
};

export default config;
