const { json } = require('express')
const PisoService = require('../service/PisoService')
const PisoRepository = require('../repository/PisoRepository')

class PisoController {
    async cadastrarPiso(req, res) {
        try {
            const piso = await PisoService.criarPiso(req.body)

            return res.status(201).json(piso)
        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async buscarPisoPorId(req, res) {
        try {
            const piso = await PisoService.buscarPisoPorId(
                req.params.id
            )

            return res.status(200).json(piso)
        } catch (error) {
            return res.status(500).json({
                erro: error.message
            })
        }
    }

    async buscarPisoPorCodigo(req, res) {
        try {
            const piso = await PisoService.buscarPisoPorCodigo(
                req.params.codigo
            )

            return res.status(200).json(piso)
        } catch (error) {
            return res.status(500).json({
                erro: error.message
            })
        }
    }

    async listarTodosPisos(req, res) {
        try {
            const piso = await PisoService.listarTodosPisos()

            return res.status(200).json(piso)
        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async listarPisosPorEstacionamentoId(req, res) {
        try {
            const pisos = await PisoService.listarPisosPorEstacionamentoId(
                req.params.estacionamento_id
            )

            return res.status(200).json(pisos)
        } catch (error) {
            return res.status(400).json({
                erro: error.message
            })
        }
    }

    async buscarPisoPorAndar(req, res){
        try {
            const piso = await PisoService.buscarPisoPorAndar(
                req.params.andar
            )
            
            return res.status(200).json(piso)
        } catch (error) {
            return res.status(500).json({
                erro: error.message
            })
        }
    }

    async editarPiso(req, res){
        try {
            const piso = await PisoService.editarPiso(
                req.params.id,
                req.body
            )

            return res.status(200).json(piso)
        } catch (error) {
            return res.status(500).json({
                erro: error.message
            })
        }
    }

    async excluirPiso(req, res){
        try {
            const piso = await PisoService.excluirPiso(
                req.params.id
            )

            return res.status(200).json({
                sucesso: 'Piso apagado com sucesso!'
            })
        } catch (error) {
            return res.status(500).json({
                erro: error.message
            })
        }
    }
}

module.exports = new PisoController()