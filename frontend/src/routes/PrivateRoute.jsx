import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function PrivateRoute({ children, apenasAdmin = false }) {
    const { autenticado, usuario } = useAuth()

    if (!autenticado) {
        return <Navigate to="/login" replace />
    }

    if (apenasAdmin && !usuario?.is_admin) {
        return <Navigate to="/motorista" replace />
    }

    return children
}
