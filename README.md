# HubParking

HubParking é um sistema de gerenciamento de estacionamento abrangente. O projeto é dividido em um back-end construído em Node.js com Express e um front-end moderno desenvolvido com React e Vite.

## Estrutura do Projeto

A aplicação adota uma arquitetura modularizada, separando claramente as responsabilidades entre o cliente (front-end) e o servidor (back-end).

### Tecnologias Utilizadas

#### Back-end
- **Plataforma:** Node.js
- **Framework Web:** Express
- **Banco de Dados:** Knex.js (Query Builder) com suporte a PostgreSQL e SQLite3.
- **Segurança:** bcrypt para hash de senhas.
- **Configuração:** dotenv para gerenciamento de variáveis de ambiente.

#### Front-end
- **Biblioteca Principal:** React
- **Build Tool:** Vite (rápido e otimizado)
- **Roteamento:** React Router DOM
- **Linting:** ESLint para manter a qualidade e padronização do código.

---

## Módulos do Sistema

O back-end foi desenhado em uma arquitetura modular, onde cada entidade de negócio possui sua própria pasta contendo rotas, controladores, serviços e repositórios.

Os principais módulos do sistema incluem:

1. **Estacionamento (`estacionamento`):** Gerenciamento principal das configurações gerais do estacionamento.
2. **Pessoas (`pessoa`):** Cadastro de clientes, funcionários ou usuários do sistema.
3. **Pisos (`piso`):** Gerenciamento dos andares e níveis de estacionamento disponíveis.
4. **Turnos (`turno`):** Controle dos turnos de trabalho dos operadores/funcionários.
5. **Vagas (`vaga`):** Gerenciamento individual das vagas (ocupadas, disponíveis, reservadas).
6. **Veículos (`veiculo`):** Cadastro e histórico dos veículos associados aos clientes e às vagas.

---

## Como Executar

### Pré-requisitos
- Node.js instalado (v18+)
- Gerenciador de pacotes (NPM ou Yarn)
- Banco de dados configurado (PostgreSQL ou SQLite3 de acordo com o ambiente)

### Rodando o Back-end
1. Navegue até o diretório `backend`.
2. Instale as dependências: `npm install`
3. Inicie o servidor: `npm start` (Geralmente roda na porta 3000)

### Rodando o Front-end
1. Navegue até o diretório `frontend`.
2. Instale as dependências: `npm install`
3. Inicie o servidor de desenvolvimento: `npm run dev` (O Vite geralmente disponibiliza a aplicação na porta 5173 ou 5174)

---

## Estrutura de Diretórios Front-end

O front-end também possui uma estrutura bem organizada:
- `components/`: Componentes reutilizáveis da interface (botões, modais, etc).
- `pages/`: Telas e visões completas da aplicação.
- `routes/`: Definições das rotas do React Router.
- `services/`: Integração com as APIs do Back-end.
- `context/` & `hooks/`: Gerenciamento de estado global e hooks customizados do React.
- `layouts/`: Estruturas de página globais, como barras de navegação e rodapés.
- `constants/`, `utils/`, `mock/`: Funções utilitárias, dados simulados e constantes.

---

Este projeto visa modernizar e agilizar todo o processo de gestão, desde a entrada de veículos até o acompanhamento em tempo real das vagas e o controle gerencial por turnos.
