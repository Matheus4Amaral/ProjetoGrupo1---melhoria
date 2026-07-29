import './styles.css'

import Container from '@/components/Container'
import Button from '@/components/Button'
import Text from '@/components/Text'

import { useAuth } from '@/context/AuthContext'

export default function Painel() {
    const { usuario, logout } = useAuth()

    return (
        <Container>
            <div className="painel-card">
                <Text className="painel-titulo">
                    Bem-vindo, {usuario?.nome}!
                </Text>

                <Text className="painel-subtitulo">
                    Seu login funcionou. Esta é uma tela provisória — o painel real de cliente/administrador ainda será construído.
                </Text>

                <Button onClick={logout}>
                    Sair
                </Button>
            </div>
        </Container>
    )
}
