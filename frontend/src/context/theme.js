import { createContext, useContext } from "react"

export const ThemeContext = createContext(null)
export const THEME_STORAGE_KEY = "hubparking-theme"

export function useTheme() {
    const context = useContext(ThemeContext)

    if (!context) {
        throw new Error("useTheme precisa ser usado dentro de um ThemeProvider")
    }

    return context
}
