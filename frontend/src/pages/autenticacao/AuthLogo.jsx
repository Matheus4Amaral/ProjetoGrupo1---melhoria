import LogoHorizontal from "../../assets/logo-horizontal.png"
import LogoHorizontalWhite from "../../assets/logo-horizontal-white.png"
import { useTheme } from "../../context/theme"

export default function AuthLogo() {
    const { isDark } = useTheme()
    const logo = isDark ? LogoHorizontalWhite : LogoHorizontal

    return (
        <div className="auth-brand-logo">
            <img src={logo} alt="HubParking" />
        </div>
    )
}
