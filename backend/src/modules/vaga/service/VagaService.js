const VagaRepository = require('../repository/VagaRepository')
const PisoRepository = require('../../piso/repository/PisoRepository')
const EstacionamentoRepository = require('../../estacionamento/repository/EstacionamentoRepository')

class VagaService {
    async cadastrarVaga(dados){
        return await VagaRepository.cadastrarVaga(dados)
    }

    async listarVagas(){
        return await VagaRepository.listarVagas()
    }

    async buscarVagaPorId(id){
        return await VagaRepository.buscarVagaPorId(id)
    }

    async buscarVagaPorPisoId(pisoId){
        const pisoExistente = await PisoRepository.buscarPisoPorId(pisoId)

        if(!pisoExistente) {
            throw new Error("Ops! Parece que esse piso não existe")
        }

        return await VagaRepository.buscarVagaPorPisoId(pisoId)
    }

    async buscarVagasPorEstacionamentoId(estacionamentoId){
        const estacionamentoExistente = await EstacionamentoRepository.buscarEstacionamentoPorId(estacionamentoId)

        if(!estacionamentoExistente) {
            throw new Error("Ops! Parece que esse estacionamento não existe")
        }

        return await VagaRepository.buscarVagasPorEstacionamentoId(estacionamentoId)
    }

    async buscarVagasDesocupadas(){
        const vagasExistentes = await VagaRepository.buscarVagasDesocupadas()

        if (vagasExistentes.length === 0) {
            throw new Error("Ops! Parece que não existe nenhuma vaga cadastrada.")
        }

        return vagasExistentes
    }

    async editarVaga(id, dados){
        const vagaExistente = await VagaRepository.buscarVagaPorId(id)

        if(!vagaExistente) {
            throw new Error("Ops! Parece que essa vaga não existe")
        }

        if(dados.codigo && dados.codigo !== vagaExistente.codigo) {
            const outra = await VagaRepository.buscarVagaPorCodigo(dados.codigo)

            if(outra) {
                throw new Error("Já existe uma vaga cadastrada com esse código")
            }
        }

        if(dados.piso_id) {
            const pisoExistente = await PisoRepository.buscarPisoPorId(dados.piso_id)

            if(!pisoExistente) {
                throw new Error("Ops! Parece que esse piso não existe")
            }
        }

        return await VagaRepository.editarVaga(id, dados)
    }

}

module.exports = new VagaService()