import { useCallback, useEffect, useMemo, useState } from "react"

import { THEME_STORAGE_KEY, ThemeContext } from "./theme"

function isValidTheme(theme) {
    return theme === "light" || theme === "dark"
}

function getSystemTheme() {
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
        return "dark"
    }

    return "light"
}

function getInitialTheme() {
    if (typeof window === "undefined") {
        return "light"
    }

    try {
        const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

        if (isValidTheme(savedTheme)) {
            return savedTheme
        }
    } catch {
        // Browser storage can be unavailable in restricted browsing modes.
    }

    return getSystemTheme()
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(getInitialTheme)

    useEffect(() => {
        const root = document.documentElement

        root.dataset.theme = theme
        root.style.colorScheme = theme

        try {
            window.localStorage.setItem(THEME_STORAGE_KEY, theme)
        } catch {
            // The active theme still works when persistence is unavailable.
        }
    }, [theme])

    const toggleTheme = useCallback(() => {
        setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark")
    }, [])

    const value = useMemo(() => ({
        theme,
        isDark: theme === "dark",
        toggleTheme,
    }), [theme, toggleTheme])

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}
