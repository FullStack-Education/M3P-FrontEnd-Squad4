import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ListagemDocentesComponent } from './pages/listagem-docentes/listagem-docentes.component';
import { CadastroDocentesComponent } from './pages/cadastro-docentes/cadastro-docentes.component';
import { CadastroAlunosComponent } from './pages/cadastro-alunos/cadastro-alunos.component';
import { CadastroTurmasComponent } from './pages/cadastro-turmas/cadastro-turmas.component';
import { CadastroNotasComponent } from './pages/cadastro-notas/cadastro-notas.component';
import { ListagemNotasComponent } from './pages/listagem-notas/listagem-notas.component';
import { usuarioLogadoGuard } from './core/guards/usuario-logado.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [usuarioLogadoGuard],
  },
  {
    path: 'docente',
    children: [
      { path: '', component: CadastroDocentesComponent },
      { path: ':id', component: CadastroDocentesComponent },
    ],
    canActivate: [usuarioLogadoGuard],
  },
  {
    path: 'aluno',
    children: [
      { path: '', component: CadastroAlunosComponent },
      { path: ':id', component: CadastroAlunosComponent },
    ],
    canActivate: [usuarioLogadoGuard],
  },
  {
    path: 'turma',
    children: [
      { path: '', component: CadastroTurmasComponent },
      { path: ':id', component: CadastroTurmasComponent },
    ],
    canActivate: [usuarioLogadoGuard],
  },
  {
    path: 'nota',
    children: [
      { path: '', component: CadastroNotasComponent },
      { path: 'aluno/:id', component: CadastroNotasComponent },
    ],
    canActivate: [usuarioLogadoGuard],
  },
  {
    path: 'docentes',
    component: ListagemDocentesComponent,
    canActivate: [usuarioLogadoGuard],
  },
  {
    path: 'notas',
    component: ListagemNotasComponent,
    canActivate: [usuarioLogadoGuard],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
