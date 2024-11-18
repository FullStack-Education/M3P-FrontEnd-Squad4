# LabPCP: Sistema Web para Gestão Educacional

## Introdução

Este repositório contém o projeto avaliativo do módulo final do curso Fullstack, turma Education do programa Floripa Mais Tec.

O objetivo do projeto foi criar uma aplicação Frontend voltada para a gestão de docentes, alunos, turmas e notas, totalmente integrada a uma API desenvolvida exclusivamente para este propósito. O resultado foi o LabPCP, uma plataforma moderna e intuitiva que centraliza todas as informações necessárias para o gerenciamento educacional.

Com o LabPCP, é possível acessar e gerenciar dados de forma eficiente, oferecendo perfis de acesso com diferentes níveis de permissões. Além disso, a plataforma é responsiva, garantindo que possa ser utilizada de qualquer lugar e em qualquer dispositivo conectado à internet.

O sistema foi desenvolvido utilizando o framework Angular, com as seguintes características:

- Utiliza roteamento para gerenciamento de páginas.
- Gerencia o estado global quando necessário.
- Utiliza consumo da API ViaCEP para cadastro de endereço.
- Totalmente integrada com a API desenvolvida para este projeto.
- Utiliza o sessionStorage para manter a sessão do usuário.

O layout da aplicação foi desenvolvido levando em consideração, boas praticas de usabilidade e acessibilidade.

- Utiliza favicon, título de página e demais assets.
- Respeita o contraste de cores e utiliza tipografia específica.
- Utiliza feedbacks visuais para o usuário (pop-ups, toasts).
- Utiliza animações de loading e transições entre páginas.
- Realiza validações em formulários.
- O layout é totalmente responsivo.

O GitHub foi utilizado como versionador de código no modelo Git Flow.
O Trello foi utilizado para organização e gerenciamento das tarefas do projeto.
O Discord foi utilizado como canal de comunicação.

## Tecnologias Utilizadas

- HTML
- CSS/SCSS
- JavaScript
- Angular com TypeScript

## Ferramentas Utilizadas

- Visual Studio Code
- Google Chrome
- Figma
- Trello
- GitHub

## Pré-Requisitos

- Node 20 ou superior
- Angular 18 ou superior
- Google Chrome
- Visual Studio Code
- Git

## Dependências

A aplicação utiliza várias bibliotecas e frameworks para garantir uma experiência de desenvolvimento rica e funcional. Abaixo estão as principais dependências:

- @angular/animations: Fornece suporte a animações para sua aplicação Angular.
- @angular/cdk: Componente de desenvolvimento (Component Dev Kit) utilizado para criar componentes complexos.
- @angular/common: Inclui diretivas comuns, serviços e funcionalidades básicas para aplicações Angular.
- @angular/compiler: Responsável por compilar os templates Angular e gerar o código necessário.
- @angular/core: O núcleo do framework Angular, necessário para criar componentes e serviços.
- @angular/forms: Fornece diretivas e serviços para criar formulários reativos e baseados em templates.
- @angular/material: Conjunto de componentes UI que seguem as diretrizes de Material Design.
- @angular/platform-browser: Serviços e diretivas relacionados ao navegador, essenciais para renderizar a aplicação.
- @angular/platform-browser-dynamic: Utilizado para compilar a aplicação diretamente no navegador.
- @angular/router: Ferramenta de roteamento para navegação entre componentes e páginas.
- @ng-select/ng-select: Um componente de seleção altamente personalizável para Angular.
- jwt-decode: ^4.0.0 - Biblioteca para decodificar tokens JWT de maneira eficiente.
- moment: Biblioteca para manipulação e formatação de datas e horários.
- ngx-mask: ^18.0.0 - Biblioteca Angular para máscaras de entrada customizáveis.
- ngx-toastr: Serviço para exibir notificações de forma elegante e customizável.
- rxjs: Biblioteca para programação reativa, usada para trabalhar com fluxos de dados assíncronos.
- tslib: Utilizado para ajudar na compilação TypeScript, fornecendo funções auxiliares.
- zone.js: Ferramenta usada por Angular para detectar mudanças e atualizar a interface automaticamente.

## Roteiro da Aplicação

O sistema possui as seguintes páginas e funcionalidades:

- Login
- Menu Lateral
- Toolbar
- Início (Dashboard)
- Cadastro/Edição de Docente
- Cadastro/Edição de Alunos
- Cadastro de Turmas
- Cadastro de Notas
- Listagem de Docentes
- Listagem de Avaliações

O sistema apresenta 3 versões de exibição de acordo com o perfil do usuário ativo:

- ADM: Acesso total ao sistema
- PROFESSOR: Acesso a listagem de alunos, cadastro de turmas e cadastro de avaliações
- ALUNO: Acesso a dados do aluno e listagem de notas

Todos as regras de negócio encontram-se no anexo **Documentação do Projeto**.

## Como Começar

### Clonando o Repositório

```
git clone https://github.com/FullStack-Education/M3P-FrontEnd-Squad4.git
```

### Instalando o Projeto

Abra a pasta do projeto no Visual Studio Code, abra um terminal e digite o comando abaixo:

```
npm install
```

### Executar o Backend

Ainda no terminal, digite o comando abaixo:

```
json-server ./src/app/shared/mocks/data.json
```

### Executar o Frontend

Abra um segundo terminal e digite o comando abaixo:

```
ng serve
```

## Anexos:

- [Documentação do Projeto](FullStack%20%5BEducation%5D%20-%20Módulo%203%20-%20Projeto%20Avaliativo.pdf)
- [Quadro de Atividades do Trello](https://trello.com/invite/b/670996c64e01cf82926d2fbf/ATTIb0033af209a2fcc95e584847c61e13303FF286C2/m3p-frontend-squad-4)
- [Módulo de Backend](https://github.com/FullStack-Education/M3P-BackEnd-Squad4.git)
