const PisoRepository = require("../repository/PisoRepository")

class PisoService {
    async criarPiso(dados) {
        const pisoExistente = await PisoRepository.buscarPisoPorCodigoNoEstacionamento(
            dados.codigo,
            dados.estacionamento_id
        )

        if (pisoExistente) {
            throw new Error("Ops! Parece que já existe um piso cadastrado com esse código neste estacionamento!")
        }

        return await PisoRepository.criarPiso(dados)
    }

    async buscarPisoPorId(id) {
        const pisoExistente = await PisoRepository.buscarPisoPorId(id)

        if (!pisoExistente) {
            throw new Error("Ops! Nenhum piso foi encontrado")
        }

        return pisoExistente
    }

    async buscarPisoPorCodigo(codigo, estacionamentoId) {
        const pisoExistente = await PisoRepository.buscarPisoPorCodigoNoEstacionamento(
            codigo,
            estacionamentoId
        )

        if (!pisoExistente) {
            throw new Error("Ops! Nenhum piso foi encontrado com esse código")
        }

        return pisoExistente
    }

    async listarTodosPisos() {
        return await PisoRepository.listarTodosPisos()
    }

    async listarPisosPorEstacionamentoId(estacionamentoId) {
        return await PisoRepository.buscarPisosPorEstacionamentoId(estacionamentoId)
    }

    async buscarPisoPorAndar(andar) {
        return await PisoRepository.buscarPisoPorAndar(andar)
    }

    async editarPiso(id, dados) {
        const pisoExistente = await PisoRepository.buscarPisoPorId(id)

        if (!pisoExistente) {
            throw new Error("Ops! Parece que o piso não existe")
        }

        if (
            dados.codigo &&
            dados.codigo !== pisoExistente.codigo
        ) {
            const estacionamentoId = dados.estacionamento_id || pisoExistente.estacionamento_id

            const outro = await PisoRepository.buscarPisoPorCodigoNoEstacionamento(
                dados.codigo,
                estacionamentoId
            )

            if (outro && outro.id !== id) {
                throw new Error("Já existe um piso cadastrado com esse código neste estacionamento")
            }
        }

        return await PisoRepository.editarPiso(id, dados)
    }

    async excluirPiso(id) {
        const pisoExistente = await PisoRepository.buscarPisoPorId(id)

        if (!pisoExistente) {
            throw new Error("Ops! Parece que o piso não existe")
        }

        return await PisoRepository.excluirPiso(id)
    }
}

module.exports = new PisoService()