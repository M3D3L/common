import typography from "@tailwindcss/typography"
import animate from "tailwindcss-animate"

/** @type {import('tailwindcss').Config} */
export const darkMode = ["class"]
export const safelist = ["dark"]
export const prefix = ""
export const theme = {
  container: {
    center: true,
    padding: "2rem",
    screens: {
      "2xl": "1400px",
    },
  },
  extend: {
    colors: {
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
      },
      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: "hsl(var(--destructive-foreground))",
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
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
      xl: "calc(var(--radius) + 4px)",
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
    },
    keyframes: {
      "accordion-down": {
        from: { height: 0 },
        to: { height: "var(--radix-accordion-content-height)" },
      },
      "accordion-up": {
        from: { height: "var(--radix-accordion-content-height)" },
        to: { height: 0 },
      },
      "collapsible-down": {
        from: { height: 0 },
        to: { height: "var(--radix-collapsible-content-height)" },
      },
      "collapsible-up": {
        from: { height: "var(--radix-collapsible-content-height)" },
        to: { height: 0 },
      },
    },
    animation: {
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out",
      "collapsible-down": "collapsible-down 0.2s ease-in-out",
      "collapsible-up": "collapsible-up 0.2s ease-in-out",
    },
    whiteList: {
      ".bg-opacity-20": true,
    },
    typography: (theme) => ({
      DEFAULT: {
        css: {
          color: theme('colors.foreground'),
          a: { color: theme('colors.primary.DEFAULT') },
          strong: { color: theme('colors.foreground') },
          'ul > li::before': { backgroundColor: theme('colors.muted.foreground') },
          hr: { borderColor: theme('colors.border') },
          blockquote: {
            color: theme('colors.muted.foreground'),
            borderLeftColor: theme('colors.border'),
          },
          h1: { color: theme('colors.foreground') },
          h2: { color: theme('colors.foreground') },
          h3: { color: theme('colors.foreground') },
          h4: { color: theme('colors.foreground') },
          code: { color: theme('colors.accent.foreground') },
          'pre code': { backgroundColor: theme('colors.muted.DEFAULT') },
          pre: {
            color: theme('colors.foreground'),
            backgroundColor: theme('colors.border'),
          },
          thead: {
            color: theme('colors.foreground'),
            borderBottomColor: theme('colors.border'),
          },
          tbody: {
            tr: {
              borderBottomColor: theme('colors.border'),
            },
          },
        },
      },
      dark: {
        css: {
          color: theme('colors.foreground'),
          a: { color: theme('colors.primary.DEFAULT') },
          strong: { color: theme('colors.foreground') },
          'ul > li::before': { backgroundColor: theme('colors.muted.foreground') },
          hr: { borderColor: theme('colors.border') },
          blockquote: {
            color: theme('colors.muted.foreground'),
            borderLeftColor: theme('colors.border'),
          },
          h1: { color: theme('colors.foreground') },
          h2: { color: theme('colors.foreground') },
          h3: { color: theme('colors.foreground') },
          h4: { color: theme('colors.foreground') },
          code: { color: theme('colors.accent.foreground') },
          'pre code': { backgroundColor: theme('colors.muted.DEFAULT') },
          pre: {
            color: theme('colors.foreground'),
            backgroundColor: theme('colors.muted.DEFAULT'),
          },
          thead: {
            color: theme('colors.foreground'),
            borderBottomColor: theme('colors.border'),
          },
          tbody: {
            tr: {
              borderBottomColor: theme('colors.border'),
            },
          },
        },
      },
    }),
  },
}
export const plugins = [animate, typography]
