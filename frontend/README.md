# Levty Team 1 (Hub Parking) - Frontend

**O Hub Parking é um sistema de gerenciamento de vagas para um estacionamento.**

Frontend da aplicação **Hub Parking**, desenvolvido com **React** e **Vite**.

## Tecnologias

* React
* Vite
* JavaScript
* HTML5
* CSS3

---

# Clonando o projeto

Clone o repositório:

```bash
git clone https://github.com/marcelobelisario/levty-team-1.git
```

Entre na pasta do frontend:

```bash
cd levty-team-1/frontend
```

---

# Instalando as dependências

Execute:

```bash
npm install
```

Caso utilize Yarn:

```bash
yarn
```

---

# Executando o projeto

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

ou

```bash
yarn dev
```

Após executar um dos comandos acima, o Vite iniciará a aplicação.

Normalmente ela ficará disponível em:

```
http://localhost:5173
```

---

# Estrutura do projeto

```
src
│
├── assets/
├── components/
├── constants/
├── context/
├── hooks/
├── layouts/
├── mock/
├── pages/
├── routes/
├── services/
├── utils/
├── App.jsx
└── main.jsx
```

## Responsabilidade de cada pasta

| Pasta | Objetivo |
|--------|----------|
| **assets** | Armazenar arquivos estáticos, como imagens, ícones, fontes e estilos. |
| **components** | Componentes reutilizáveis da interface. |
| **constants** | Constantes utilizadas em toda a aplicação. |
| **context** | Gerenciamento de estados globais utilizando Context API. |
| **hooks** | Hooks personalizados para reutilização de lógica. |
| **layouts** | Estruturas visuais compartilhadas entre diferentes páginas. |
| **mock** | Dados fictícios utilizados durante o desenvolvimento. |
| **pages** | Telas da aplicação organizadas por perfil de usuário. |
| **routes** | Configuração das rotas da aplicação. |
| **services** | Comunicação entre o frontend e a API do backend. |
| **utils** | Funções auxiliares reutilizáveis. |

---

# Fluxo da aplicação

A arquitetura do frontend segue o seguinte fluxo:

```
main.jsx
    │
    ▼
App.jsx
    │
    ▼
Routes
    │
    ▼
Layouts
    │
    ▼
Pages
    │
    ▼
Components
    │
    ▼
Services
    │
    ▼
API (Backend)
```

### Explicação

- **main.jsx** → ponto de entrada da aplicação React.
- **App.jsx** → componente principal da aplicação.
- **Routes** → define a navegação entre as páginas.
- **Layouts** → estrutura visual compartilhada pelas páginas.
- **Pages** → representam as telas do sistema.
- **Components** → elementos reutilizáveis da interface.
- **Services** → realizam a comunicação com o backend.

---

# Organização das páginas

As páginas são separadas conforme o perfil de acesso do usuário.

```
pages
│
├── autenticacao/
│
├── administrador/
│
└── cliente/
```

Essa organização facilita a manutenção e acompanha os diferentes perfis existentes no sistema.

---

# Padrão de desenvolvimento

Durante o desenvolvimento, seguir as seguintes diretrizes:

- Componentes reutilizáveis devem ser criados em `components`.
- Telas devem ser implementadas em `pages`.
- Toda comunicação com o backend deve ser realizada através de `services`.
- Estados globais devem ser centralizados em `context`.
- Hooks personalizados devem ser criados em `hooks`.
- Funções auxiliares devem ficar em `utils`.
- Evitar realizar chamadas HTTP diretamente dentro dos componentes.

---

# Padrão de commits

Utilizar, sempre que possível, o padrão Conventional Commits.

Exemplos:

```text
feat: implementar tela de login

fix: corrigir validação de formulário

refactor: reorganizar componentes

style: ajustar responsividade do dashboard

docs: atualizar README

chore: estruturar arquitetura inicial do frontend
```

---

# Integração com o backend

Toda comunicação com o backend deve ser realizada através da pasta:

```
src/services/
```

Cada entidade da aplicação deve possuir seu próprio serviço, centralizando as requisições HTTP e evitando chamadas diretas dentro das páginas ou componentes.

---

# Equipe

Projeto desenvolvido pela equipe **Levty Team 1**.