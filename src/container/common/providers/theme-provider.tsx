"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { lightTheme, darkTheme, themeConfig } from "@constants/theme";

export interface ThemeConfig {
    name: string;
    description: string;
    fontFamily: {
        sans: string[];
        mono: string[];
    };
    breakpoints: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        "2xl": number;
    };
    colors: {
        primary: string;
        secondary: string;
        danger: string;
        warning: string;
        success: string;
        info: string;
    };
}

export type Theme = "light" | "dark" | "system";

interface ThemeProviderState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    themeSettings: ThemeConfig;
    currentThemeValues: Record<string, string | number | string[]>;
}

const initialState: ThemeProviderState = {
    theme: "system",
    setTheme: () => null,
    themeSettings: themeConfig,
    currentThemeValues: lightTheme,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: Theme;
}

export function ThemeProvider({
    children,
    defaultTheme = "system",
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(defaultTheme);
    const [currentThemeValues, setCurrentThemeValues] = useState<Record<string, string | number | string[]>>(lightTheme);

    useEffect(() => {
        const root = window.document.documentElement;

        // Remove previous theme classes
        root.classList.remove("light", "dark");

        // Apply new theme
        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
            root.classList.add(systemTheme);
            setCurrentThemeValues(systemTheme === "dark" ? darkTheme : lightTheme);
        } else {
            root.classList.add(theme);
            setCurrentThemeValues(theme === "dark" ? darkTheme : lightTheme);
        }

        // Update local storage preference
        localStorage.setItem("theme", theme);
    }, [theme]);

    // Listen for system theme changes
    useEffect(() => {
        if (theme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

            const handleChange = (e: MediaQueryListEvent) => {
                const root = window.document.documentElement;
                root.classList.remove("light", "dark");
                const newTheme = e.matches ? "dark" : "light";
                root.classList.add(newTheme);
                setCurrentThemeValues(newTheme === "dark" ? darkTheme : lightTheme);
            };

            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }
    }, [theme]);

    // Initialize theme from local storage
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as Theme | null;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    const value = {
        theme,
        setTheme,
        themeSettings: themeConfig,
        currentThemeValues,
    };

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
