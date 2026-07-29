import { Navigate, Route, Routes } from "react-router-dom"

import Login from "../pages/autenticacao/Login"
import Cadastro from "../pages/autenticacao/Cadastro"
import Painel from "../pages/painel"

import PrivateRoute from "./PrivateRoute"

import AdminLayout from "../layouts/AdminLayout"
import MotoristaLayout from "../layouts/MotoristaLayout"
import Hub from "../pages/motorista/Hub"
import EstacionamentoVagas from "../pages/motorista/EstacionamentoVagas"
import MeusVeiculos from "../pages/motorista/MeusVeiculos"
import Dashboard from "../pages/administrador/Dashboard"
import Veiculos from "../pages/administrador/Veiculos"
import Estacionamento from "../pages/administrador/Estacionamento"
import EditarEstacionamento from "../pages/administrador/EditarEstacionamento"
import Pisos from "../pages/administrador/Pisos"
import Turnos from "../pages/administrador/Turnos"
import EditarPiso from "../pages/administrador/EditarPiso"
import Vagas from "../pages/administrador/Vagas"
import EditarVaga from "../pages/administrador/EditarVaga"
import Configuracoes from "../pages/conta/Configuracoes"

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />

            <Route
                path="/painel"
                element={
                    <PrivateRoute>
                        <Painel />
                    </PrivateRoute>
                }
            />

            <Route
                path="/motorista"
                element={
                    <PrivateRoute>
                        <MotoristaLayout>
                            <Hub />
                        </MotoristaLayout>
                    </PrivateRoute>
                }
            />

            <Route
                path="/motorista/estacionamentos/:id"
                element={
                    <PrivateRoute>
                        <MotoristaLayout>
                            <EstacionamentoVagas />
                        </MotoristaLayout>
                    </PrivateRoute>
                }
            />

            <Route
                path="/motorista/veiculos"
                element={
                    <PrivateRoute>
                        <MotoristaLayout>
                            <MeusVeiculos />
                        </MotoristaLayout>
                    </PrivateRoute>
                }
            />

            <Route
                path="/motorista/configuracoes"
                element={
                    <PrivateRoute>
                        <MotoristaLayout>
                            <Configuracoes />
                        </MotoristaLayout>
                    </PrivateRoute>
                }
            />      

            <Route
                path="/admin/dashboard"
                element={
                    <PrivateRoute apenasAdmin>
                        <AdminLayout>
                            <Dashboard />
                        </AdminLayout>
                    </PrivateRoute>
                }
            />

            <Route
                path="/admin/veiculos"
                element={
                    <PrivateRoute apenasAdmin>
                        <AdminLayout>
                            <Veiculos />
                        </AdminLayout>
                    </PrivateRoute>
                }
            />

            <Route
                path="/admin/estacionamento"
                element={
                    <PrivateRoute apenasAdmin>
                        <AdminLayout>
                            <Estacionamento />
                        </AdminLayout>
                    </PrivateRoute>
                }
            />

            <Route
                path="/admin/estacionamento/:id/editar"
                element={
                    <PrivateRoute apenasAdmin>
                        <AdminLayout>
                            <EditarEstacionamento />
                        </AdminLayout>
                    </PrivateRoute>
                }
            />

            <Route
                path="/admin/pisos"
                element={
                    <PrivateRoute apenasAdmin>
                        <AdminLayout>
                            <Pisos />
                        </AdminLayout>
                    </PrivateRoute>
                }
            />

            <Route
                path="/admin/turnos"
                element={
                    <PrivateRoute apenasAdmin>
                        <AdminLayout>
                            <Turnos />
                        </AdminLayout>
                    </PrivateRoute>
                }
            />

            <Route
                path="/admin/pisos/:id/editar"
                element={
                    <PrivateRoute apenasAdmin>
                        <AdminLayout>
                            <EditarPiso />
                        </AdminLayout>
                    </PrivateRoute>
                }
            />

            <Route
                path="/admin/vagas"
                element={
                    <PrivateRoute apenasAdmin>
                        <AdminLayout>
                            <Vagas />
                        </AdminLayout>
                    </PrivateRoute>
                }
            />

            <Route
                path="/admin/vagas/:id/editar"
                element={
                    <PrivateRoute apenasAdmin>
                        <AdminLayout>
                            <EditarVaga />
                        </AdminLayout>
                    </PrivateRoute>
                }
            />

            <Route
                path="/admin/configuracoes"
                element={
                    <PrivateRoute apenasAdmin>
                        <AdminLayout>
                            <Configuracoes />
                        </AdminLayout>
                    </PrivateRoute>
                }
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    )
}
