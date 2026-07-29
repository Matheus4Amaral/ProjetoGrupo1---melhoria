const PisoRepository = require("../repository/PisoRepository")
const VagaRepository = require("../../vaga/repository/VagaRepository")

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

        if (dados.vagas && dados.vagas !== pisoExistente.vagas) {
            const numAntigo = pisoExistente.vagas;
            const numNovo = dados.vagas;

            if (numNovo > numAntigo) {
                for (let j = numAntigo + 1; j <= numNovo; j++) {
                    const codigoVaga = `${pisoExistente.codigo}-V${j}`;
                    await VagaRepository.cadastrarVaga({
                        piso_id: pisoExistente.id,
                        codigo: codigoVaga,
                        nome: `Vaga ${j}`,
                        is_ocupada: false
                    });
                }
            } else {
                const vagasDoPiso = await VagaRepository.buscarVagaPorPisoId(pisoExistente.id);
                
                vagasDoPiso.sort((a, b) => {
                    const numA = parseInt(a.nome.replace(/\D/g, '')) || 0;
                    const numB = parseInt(b.nome.replace(/\D/g, '')) || 0;
                    if (numA !== numB) return numB - numA;
                    return new Date(b.criado_em) - new Date(a.criado_em);
                });

                const qtdRemover = numAntigo - numNovo;
                const vagasParaRemover = vagasDoPiso.slice(0, qtdRemover);

                const vagasOcupadas = vagasParaRemover.filter(v => v.is_ocupada);
                if (vagasOcupadas.length > 0) {
                    throw new Error("Não é possível reduzir o número de vagas, pois algumas vagas que seriam removidas estão ocupadas.");
                }

                for (const v of vagasParaRemover) {
                    await VagaRepository.excluirVaga(v.id);
                }
            }
        }

        return await PisoRepository.editarPiso(id, dados)
    }

    async excluirPiso(id){
        const pisoExistente = await PisoRepository.buscarPisoPorId(id)

        if (!pisoExistente) {
            throw new Error("Ops! Parece que o piso não existe")
        }

        const vagasDoPiso = await VagaRepository.buscarVagaPorPisoId(id);

        const vagasOcupadas = vagasDoPiso.filter(v => v.is_ocupada);
        if (vagasOcupadas.length > 0) {
            throw new Error("Não é possível excluir o piso, pois existem vagas ocupadas neles.");
        }

        for (const v of vagasDoPiso) {
            await VagaRepository.excluirVaga(v.id);
        }

        return await PisoRepository.excluirPiso(id)
    }
}

module.exports = new PisoService()