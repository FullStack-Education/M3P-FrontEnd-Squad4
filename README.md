# LabPCP: Sistema Web para Gestão Educacional

## Introdução

Este é o projeto avaliativo do módulo de Frontend do curso Fullstack, da turma Education do Floripa Mais Tec.
O objetivo do projeto é desenvolver uma aplicação Frontend voltada para a gestão de docentes, alunos, turmas e notas,
que será futuramente integrada a API real.
O projeto possui alguns requisitos:

1. O sistema deve seguir o Roteiro da Aplicação.
2. O sistema deverá ser desenvolvido utilizando o framework Angular.

- Utilizar roteamento para gerenciamento de páginas.
- Gerenciar o estado global quando necessário.
- Utilizar consumo da API ViaCEP para cadastro de endereço.

3. Elaborar o layout da aplicação, levando em consideração, boas praticas de usabilidade e acessibilidade.

- Utilizar favicon, título de página e demais assets.
- Atenção ao contraste de cores e tipografia utilizada.
- Utilizar feedbacks visuais para o usuário (pop-ups, toasts)+
- Utilizar animações de loading e ou transições entre páginas.
- Realizar validações em formulários+

4. O layout deverá ser responsivo.
5. Utilizar o localStorage ou JSON Server para guardar as informações cadastradas.
6. Utilizar o GitHub como versionador de código:
   - Utilização do padrão baseado em GitFlow com main, develop e features.
   - Utilização de commits curtos e concisos.
7. Utilizar Trello para organização das tarefas a serem realizadas.

## Tecnologias Utilizadas

- HTML
- CSS/SCSS
- JavaScript
- Angular

## Ferramentas Utilizadas

- Visual Studio Code
- JSON Server
- Google Chrome
- Figma
- Trello
- GitHub

## Pré-Requisitos

- Node 20 ou superior
- Angular 18 ou superior
- JSON Server
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
- moment: Biblioteca para manipulação e formatação de datas e horários.
- ngx-toastr: Serviço para exibir notificações de forma elegante e customizável.
- rxjs: Biblioteca para programação reativa, usada para trabalhar com fluxos de dados assíncronos.
- tslib: Utilizado para ajudar na compilação TypeScript, fornecendo funções auxiliares.
- zone.js: Ferramenta usada por Angular para detectar mudanças e atualizar a interface automaticamente.

## Roteiro da Aplicação

Possuir as seguintes páginas e funcionalidades:

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

Todos as regras de negócio encontram-se no anexo **Documentação do Projeto**.

## Como Começar

### Clonando o Repositório

```
git clone https://github.com/scheiladev/senai-fullstack-education-projeto-final-modulo02.git
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

- [Documentação do Projeto](FullStack%20%5BEducation%5D%20-%20Módulo%202%20-%20Projeto%20Avaliativo.pdf)
- [Quadro de Atividades do Trello](https://trello.com/invite/b/66a2cf2faaaf3e9279d59779/ATTI284c04d91ebfa0393d0687cf8fc90c4505C2016B/projeto-final-modulo-02)
