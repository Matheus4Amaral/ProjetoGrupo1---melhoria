const swaggerJsdoc = require('swagger-jsdoc')

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'HubParking API',
            version: '1.0.0',
            description: "Documentação da API do sistema HubParking."
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor Local'
            }
        ],
        tags: [
            {
                name: 'Pessoa',
                description: 'Operações relacionadas às pessoas'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Insira o token JWT gerado no login.'
                }
            },
            schemas: {
                Pessoa: {
                    type: 'object',
                    required: [
                        'nome',
                        'email',
                        'senha',
                        'logradouro',
                        'bairro',
                        'numero',
                        'cidade_id',
                        'cpf'
                    ],
                    properties: {
                        id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
                        nome: { type: 'string', example: 'USUARIO SEED' },
                        email: { type: 'string', example: 'SEED@email.com' },
                        senha: { type: 'string', example: '123456' },
                        logradouro: { type: 'string', example: 'SD' },
                        bairro: { type: 'string', example: 'SD' },
                        numero: { type: 'integer', example: 285 },
                        complemento: { type: 'string', example: 'SD 404' },
                        cidade_id: { type: 'string', format: 'uuid', example: '0000bd7a-a9d3-46cc-8e5c-b44f1d5fcca9' },
                        cpf: { type: 'string', example: '12332112332' },
                        is_admin: { type: 'boolean', example: false },
                        id_turno: { type: 'string', format: 'uuid', example: 'abd6ae94-53e1-4e81-b5b5-7f265aa039b2' },
                        estacionamento_id: { type: 'string', format: 'uuid', example: 'ae3208ab-6195-49f0-8eb4-fe1ba1a79b90' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        erro: {
                            type: 'string',
                            example: 'Ocorreu um erro.'
                        }
                    }
                }
            },
            responses: {
                BadRequest: {
                    description: 'Requisição inválida ou parâmetros incorretos.',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                Unauthorized: {
                    description: 'Não autorizado. Token JWT ausente ou inválido.',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                NotFound: {
                    description: 'Recurso não encontrado.',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                InternalError: {
                    description: 'Erro interno no servidor.',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },

    apis: [
        './src/modules/*/routes/*.js'
    ]
}

const swaggerSpec = swaggerJsdoc(options)

module.exports = swaggerSpec