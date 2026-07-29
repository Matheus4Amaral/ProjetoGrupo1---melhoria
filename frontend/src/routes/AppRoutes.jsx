import { Navigate, Route, Routes } from "react-router-dom"

import Login from '@/pages/Autenticacao/Login'
import Cadastro from '@/pages/Autenticacao/Cadastro'
import Painel from '@/pages/Painel'

import PrivateRoute from "./PrivateRoute"

import AdminLayout from '@/layouts/AdminLayout'
import MotoristaLayout from '@/layouts/MotoristaLayout'
import Hub from '@/pages/Motorista/Hub'
import EstacionamentoVagas from '@/pages/Motorista/EstacionamentoVagas'
import MeusVeiculos from '@/pages/Motorista/MeusVeiculos'
import Dashboard from '@/pages/Administrador/Dashboard'
import Veiculos from '@/pages/Administrador/Veiculos'
import Estacionamento from '@/pages/Administrador/Estacionamento'
import EditarEstacionamento from '@/pages/Administrador/EditarEstacionamento'
import Pisos from '@/pages/Administrador/Pisos'
import Turnos from '@/pages/Administrador/Turnos'
import EditarPiso from '@/pages/Administrador/EditarPiso'
import Vagas from '@/pages/Administrador/Vagas'
import EditarVaga from '@/pages/Administrador/EditarVaga'

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
                            <Painel />
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

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    )
}
