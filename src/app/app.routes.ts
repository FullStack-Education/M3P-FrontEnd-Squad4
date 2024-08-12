import { Routes } from '@angular/router';
import { usuarioLogadoGuard } from './core/guards/usuario-logado.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((c) => c.HomeComponent),
    canActivate: [usuarioLogadoGuard],
  },
  {
    path: 'docente',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/cadastro-docentes/cadastro-docentes.component').then(
            (c) => c.CadastroDocentesComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/cadastro-docentes/cadastro-docentes.component').then(
            (c) => c.CadastroDocentesComponent
          ),
      },
    ],
    canActivate: [usuarioLogadoGuard],
  },
  {
    path: 'aluno',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/cadastro-alunos/cadastro-alunos.component').then(
            (c) => c.CadastroAlunosComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/cadastro-alunos/cadastro-alunos.component').then(
            (c) => c.CadastroAlunosComponent
          ),
      },
    ],
    canActivate: [usuarioLogadoGuard],
  },
  {
    path: 'turma',
    loadComponent: () =>
      import('./pages/cadastro-turmas/cadastro-turmas.component').then(
        (c) => c.CadastroTurmasComponent
      ),
    canActivate: [usuarioLogadoGuard],
  },
  {
    path: 'nota',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/cadastro-notas/cadastro-notas.component').then(
            (c) => c.CadastroNotasComponent
          ),
      },
      {
        path: 'aluno/:id',
        loadComponent: () =>
          import('./pages/cadastro-notas/cadastro-notas.component').then(
            (c) => c.CadastroNotasComponent
          ),
      },
    ],
    canActivate: [usuarioLogadoGuard],
  },
  {
    path: 'docentes',
    loadComponent: () =>
      import('./pages/listagem-docentes/listagem-docentes.component').then(
        (c) => c.ListagemDocentesComponent
      ),
    canActivate: [usuarioLogadoGuard],
  },
  {
    path: 'notas',
    loadComponent: () =>
      import('./pages/listagem-notas/listagem-notas.component').then(
        (c) => c.ListagemNotasComponent
      ),
    canActivate: [usuarioLogadoGuard],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
