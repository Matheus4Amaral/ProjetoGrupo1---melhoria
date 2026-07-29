const EstacionamentoRepository = require("../repository/EstacionamentoRepository")
const GerenteEstacionamentoRepository = require("../../gerenteEstacionamento/repository/GerenteEstacionamentoRepository")
const PisoRepository = require("../../piso/repository/PisoRepository")
const VagaRepository = require("../../vaga/repository/VagaRepository")

class EstacionamentoService {
    async criarEstacionamento(dados) {
        // pessoa_id não é coluna de estacionamento: identifica o gerente dono.
        const { pessoa_id, qtd_pisos, qtd_vagas_por_piso, ...dadosEstacionamento } = dados

        const estacionamentoExistente =  await EstacionamentoRepository.buscarEstacionamentoPorCnpj(dadosEstacionamento.cnpj)

        if(estacionamentoExistente) {
            throw new Error("Ops! Parece que já existe um estacionamento cadastrado com  esse CNPJ!")
        }

        const estacionamento = await EstacionamentoRepository.criarEstacionamento(dadosEstacionamento)

        // Quem cria o estacionamento vira gerente dele (autosserviço).
        if (pessoa_id) {
            await GerenteEstacionamentoRepository.vincular(pessoa_id, estacionamento.id)
        }

        const numPisos = Number(qtd_pisos) || 1;
        const numVagas = Number(qtd_vagas_por_piso) || 10;

        for (let i = 1; i <= numPisos; i++) {
            const codigoPiso = `${estacionamento.cnpj}-P${i}`;
            const piso = await PisoRepository.criarPiso({
                codigo: codigoPiso,
                andar: i,
                nome: `Piso ${i}`,
                vagas: numVagas,
                estacionamento_id: estacionamento.id
            });

            for (let j = 1; j <= numVagas; j++) {
                const codigoVaga = `${codigoPiso}-V${j}`;
                await VagaRepository.cadastrarVaga({
                    piso_id: piso.id,
                    codigo: codigoVaga,
                    nome: `Vaga ${j}`,
                    is_ocupada: false
                });
            }
        }

        return estacionamento
    }

    async listarEstacionamentos(){
        return await EstacionamentoRepository.listarTodosEstacionamentos()
    }

    async listarEstacionamentosPorGerente(pessoaId){
        return await GerenteEstacionamentoRepository.listarEstacionamentosPorGerente(pessoaId)
    }

    async listarEstacionamentosComDisponibilidade(){
        return await EstacionamentoRepository.listarEstacionamentosComDisponibilidade()
    }

    async buscarEstacionamentoPorId(id){
        const estacionamentoExistente = await EstacionamentoRepository.buscarEstacionamentoPorId(id)

        if(!estacionamentoExistente){
            throw new Error("Ops! Estacioanmento não encontrado.")
        }

        return estacionamentoExistente
    }

    async buscarEstacionamentoPorCnpj(cnpj){
        const estacionamentoExistente = await EstacionamentoRepository.buscarEstacionamentoPorCnpj(cnpj)

        if (!estacionamentoExistente) {
            throw new Error("Ops! Estacionamento não encontrado para esse CNPJ.")
        }

        return estacionamentoExistente
    }

    async editarEstacionamento(id, dados) {
        const estacionamentoExistente = await EstacionamentoRepository.buscarEstacionamentoPorId(id)

        if(!estacionamentoExistente) {
            throw new Error("Ops! Estacionamento não encontrado.")
        }

        if(dados.cnpj && dados.cnpj !== estacionamentoExistente.cnpj) {
            const outro = await EstacionamentoRepository.buscarEstacionamentoPorCnpj(dados.cnpj)
        
            if(outro){
                throw new Error("Já existe um estacionamento com esse CNPJ.")
            }
        }
        

        return await EstacionamentoRepository.editarEstacionamento(id, dados)
    }

    async excluirEstacionamento(id){
        const estacionamentoExistente = await EstacionamentoRepository.buscarEstacionamentoPorId(id)

        if(!estacionamentoExistente) {
            throw new Error('Estacionamento não encontrado.')
        }

        return await EstacionamentoRepository.excluirEstacionamento(id)
    }
}

module.exports = new EstacionamentoService()