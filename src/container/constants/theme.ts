import { type ThemeConfig } from "@common/providers/theme-provider";

export const themeConfig: ThemeConfig = {
    name: "MeetNow",
    description: "Discover and join meetups at your favorite places.",
    fontFamily: {
        sans: [
            "Inter",
            "-apple-system",
            "BlinkMacSystemFont",
            "Segoe UI",
            "Roboto",
            "Oxygen",
            "Ubuntu",
            "Cantarell",
            "Fira Sans",
            "Droid Sans",
            "Helvetica Neue",
            "sans-serif",
        ],
        mono: [
            "SFMono-Regular",
            "SF Mono",
            "Menlo",
            "Monaco",
            "Consolas",
            "Liberation Mono",
            "Courier New",
            "monospace",
        ],
    },
    breakpoints: {
        xs: 0,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        "2xl": 1536,
    },
    colors: {
        primary: "#7057f5", // purple-ish
        secondary: "#10b981", // green
        danger: "#ef4444", // red
        warning: "#f59e0b", // amber
        success: "#22c55e", // green
        info: "#3b82f6", // blue
    },
};

// Default light and dark themes
export const lightTheme = {
    foreground: "#404040", // near black
    background: "#ffffff", // white
    card: "#ffffff", // white
    cardForeground: "#333333", // dark gray
    popover: "#ffffff", // white
    popoverForeground: "#333333", // dark gray
    primary: themeConfig.colors.primary,
    primaryForeground: "#ffffff", // white
    secondary: themeConfig.colors.secondary,
    secondaryForeground: "#ffffff", // white
    muted: "#f3f4f6", // light gray
    mutedForeground: "#71717a", // medium gray
    accent: "#ede9fe", // soft purple
    accentForeground: "#7c3aed", // darker purple
    danger: themeConfig.colors.danger,
    dangerForeground: "#ffffff", // white
    border: "#e2e8f0", // light gray
    input: "#e2e8f0", // light gray
    ring: themeConfig.colors.primary,
    radius: "0.5rem",
};

export const darkTheme = {
    foreground: "#e2e8f0", // light gray
    background: "#18181b", // very dark gray
    card: "#27272a", // dark gray
    cardForeground: "#f8fafc", // off-white
    popover: "#27272a", // dark gray
    popoverForeground: "#f8fafc", // off-white
    primary: themeConfig.colors.primary,
    primaryForeground: "#ffffff", // white
    secondary: themeConfig.colors.secondary,
    secondaryForeground: "#ffffff", // white
    muted: "#3f3f46", // medium-dark gray
    mutedForeground: "#a1a1aa", // medium gray
    accent: "#4c1d95", // dark purple
    accentForeground: "#ede9fe", // soft purple
    danger: themeConfig.colors.danger,
    dangerForeground: "#ffffff", // white
    border: "#3f3f46", // medium-dark gray
    input: "#3f3f46", // medium-dark gray
    ring: themeConfig.colors.primary,
    radius: "0.5rem",
};
