![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Cypress](https://img.shields.io/badge/Cypress-15-17202C?style=for-the-badge&logo=cypress&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Mochawesome](https://img.shields.io/badge/Mochawesome-Reports-4B5563?style=for-the-badge)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI/CD-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
[![Badge ServeRest](https://img.shields.io/badge/API-ServeRest-green)](https://github.com/ServeRest/ServeRest/)

﻿# Cypress Portfolio API

Projeto de testes automatizados de API desenvolvido com Cypress e JavaScript. A suíte valida endpoints de usuários, autenticação e produtos da API pública [ServeRest](https://serverest.dev/).

## Tecnologias

- [Cypress](https://www.cypress.io/) 15
- JavaScript (CommonJS/ES modules)
- [cypress-plugin-api](https://github.com/filiphric/cypress-plugin-api)
- Node.js e npm

## Pré-requisitos

- Node.js 18 ou superior instalado
- npm disponível no terminal
- Acesso à internet para alcançar a API ServeRest

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone <URL_DO_REPOSITORIO>
cd cypress-portfolio-api
npm install
```

## Execução dos testes

Execute todos os testes em modo headless:

```bash
npm test
```

Para abrir a interface do Cypress:

```bash
npx cypress open
```

Na interface, selecione **E2E Testing** e execute os arquivos disponíveis em `cypress/e2e`.

Para executar uma especificação específica:

```bash
npx cypress run --spec "cypress/e2e/api/users.cy.js"
npx cypress run --spec "cypress/e2e/api/product.cy.js"
```

## Cenários cobertos

### Usuários

- Cadastro com validação de campos obrigatórios
- Cadastro com e-mail já utilizado
- Consulta por ID, nome, e-mail, senha e administrador
- Consulta sem filtros e consulta sem resultados
- Consulta por ID via path
- Tratamento de ID ausente ou usuário inexistente
- Login
- Operações de edição e exclusão utilizadas no ciclo dos testes

### Produtos

- Login para obtenção do token de autorização
- Cadastro sem token
- Cadastro de produto autenticado
- Exclusão de produto autenticada

## Estrutura do projeto

```text
.
├── cypress.config.js       # Configuração do Cypress e URL base da API
├── cypress
│   ├── api                  # Classes com os clientes dos endpoints
│   ├── e2e
│   │   └── api              # Especificações de teste de usuários e produtos
│   ├── fixtures             # Dados usados pelos testes
│   └── support              # Comandos e configuração global do Cypress
├── package.json             # Dependências e scripts do projeto
└── README.md
```

## Configuração

A URL base está definida em `cypress.config.js`:

```js
baseUrl: 'https://serverest.dev/'
```

Os testes usam caminhos relativos, como `/usuarios`, `/login` e `/produtos`. Para apontar a suíte para outro ambiente, altere `e2e.baseUrl` no arquivo de configuração.

## Dados de teste

Os dados ficam em `cypress/fixtures/login.json` e `cypress/fixtures/product.json`. Como a suíte usa a API pública, os dados podem sofrer alterações ou colisões entre execuções. Atualize e-mails, credenciais e informações de produto quando necessário.

Não utilize credenciais reais nas fixtures. Para ambientes privados, prefira variáveis de ambiente do Cypress ou um mecanismo seguro de secrets.

## Troubleshooting

Se os testes de produtos retornarem `401`, verifique as credenciais em `cypress/fixtures/product.json`. O cadastro e a exclusão de produtos exigem um token válido de um usuário administrador na ServeRest. A API pública pode não manter a conta usada pela fixture entre execuções.

## Relatórios e evidências

O Cypress registra screenshots de falhas em `cypress/screenshots`. Esse diretório pode ser usado para análise local e não deve conter informações sensíveis.

## Licença

Este projeto está distribuído sob a licença ISC, conforme definido no `package.json`.
