const PisoRepository = require("../repository/PisoRepository")

class PisoService {
    async criarPiso(dados){
        const pisoExistente = await PisoRepository.buscarPisoPorCodigo(dados.codigo)

        if (pisoExistente) {
            throw new Error("Ops! Parece que já existe um piso cadastrado com esse código!")
        }

        return await PisoRepository.criarPiso(dados)
    }

    async buscarPisoPorId(id){
        const pisoExistente = await PisoRepository.buscarPisoPorId(id)

        if (!pisoExistente) {
            throw new Error("Ops! Nenhum piso foi encontrado")
        }

        return await PisoRepository.buscarPisoPorId(id)
    }

    async buscarPisoPorCodigo(codigo){
        const pisoExistente = await PisoRepository.buscarPisoPorCodigo(codigo)

        if(!pisoExistente) {
            throw new Error("Ops! Nenhum piso foi encontrado com esse código")
        }

        return await PisoRepository.buscarPisoPorCodigo(codigo)
    }

    async listarTodosPisos(){
        return await PisoRepository.listarTodosPisos()
    }

    async listarPisosPorEstacionamentoId(estacionamentoId){
        return await PisoRepository.buscarPisosPorEstacionamentoId(estacionamentoId)
    }

    async buscarPisoPorAndar(andar){
        return await PisoRepository.buscarPisoPorAndar(andar)
    }
    
    async editarPiso(id, dados){
        const pisoExistente = await PisoRepository.buscarPisoPorId(id)

        if (!pisoExistente) {
            throw new Error("Ops! Parece que o piso não existe")
        }

        if(dados.codigo && dados.codigo !== pisoExistente.codigo){
            const outro = await PisoRepository.buscarPisoPorCodigo(dados.codigo)
            
            if(outro) {
                throw new Error("Já existe um piso cadastrado com esse código")
            }
        }

        return await PisoRepository.editarPiso(id, dados)
    }

    async excluirPiso(id){
        const pisoExistente = await PisoRepository.buscarPisoPorId(id)

        if (!pisoExistente) {
            throw new Error("Ops! Parece que o piso não existe")
        }

        return await PisoRepository.excluirPiso(id)
    }
}

module.exports = new PisoService()