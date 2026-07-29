import { FiMoon, FiSun } from "react-icons/fi"

import { useTheme } from "../../context/theme"
import "./styles.css"

export default function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme()
    const nextThemeLabel = isDark ? "Ativar tema claro" : "Ativar tema escuro"

    return (
        <button
            type="button"
            className="icon-btn theme-toggle"
            aria-label={nextThemeLabel}
            title={nextThemeLabel}
            aria-pressed={isDark}
            onClick={toggleTheme}
        >
            {isDark ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
        </button>
    )
}
