# Levty Team 1 (Hub Parking) - Backend

**O Hub Parking é um sistema de gerenciamento de vagas para um estacionamento**

Backend da aplicação **Hub Parking**, desenvolvido com **Node.js**, **Express**, **Knex.js** e **PostgreSQL**.

## Tecnologias

* Node.js
* Express
* Knex.js
* PostgreSQL
* Dotenv

---

# Clonando o projeto

```bash
git clone git clone https://github.com/marcelobelisario/levty-team-1.git
```

Entre na pasta do projeto:

```bash
cd backend
```

---

# Instalando as dependências

```bash
npm install
```

---

# Configurando as variáveis de ambiente

Crie um arquivo chamado `.env` na raiz do projeto.

Utilize o seguinte modelo:

```env

DATABASE_CLIENT=pg
DATABASE_NAME=hubParking
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=sua_senha
DATABASE_HOST=localhost
DATABASE_PORT=5432
```

Altere os valores conforme a configuração do seu PostgreSQL.

---

# Criando o banco de dados

Antes de executar as migrations, crie o banco no PostgreSQL.

Exemplo:

```sql
CREATE DATABASE "hubParking";
```

---

# Executando as migrations

Após criar o banco, vá até a sua IDE e execute no terminal:

```bash
npx knex migrate:latest
```

Esse comando criará todas as tabelas do banco de dados.

---

# Executando as seeds

Após executar as migrations, execute:

```bash
npx knex seed:run
```

As seeds irão inserir os dados iniciais da aplicação.

---

# Iniciando o servidor

```bash
node app.js
```

Caso utilize Nodemon:

```bash
npm start
```

Após executar um dos dois comando acima, aparecerá a seguinte mensagem no terminal a IDE: 'Servidor rodando na porta 3000' 

O servidor ficará disponível em:

```
http://localhost:3000
```

---


# Comandos úteis

Instalar dependências:

```bash
npm install
```

Criar uma migration:

```bash
npx knex migrate:make nome_da_migration
```

Executar as migrations:

```bash
npx knex migrate:latest
```

Desfazer a última migration:

```bash
npx knex migrate:rollback
```

Criar uma seed:

```bash
npx knex seed:make nome_da_seed
```

Executar todas as seeds:

```bash
npx knex seed:run
```

---

# Padrão de desenvolvimento

* Cada tabela deve possuir sua própria migration.
* Sempre que possível, utilize UUID como chave primária.
* Toda alteração no banco deve ser feita através de migrations.
* Dados iniciais devem ser inseridos por meio de seeds.
* Nunca altere uma migration que já foi compartilhada com a equipe. Caso seja necessário modificar a estrutura do banco, crie uma nova migration.

---

# Observações

Caso alguma migration falhe, execute:

```bash
npx knex migrate:rollback
```

Corrija o problema e execute novamente:

```bash
npx knex migrate:latest
```

Se houver necessidade de recriar completamente o banco de dados, basta apagar o banco, criá-lo novamente e executar as migrations e seeds.
