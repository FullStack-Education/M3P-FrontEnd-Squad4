import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ListagemDocentesComponent } from './pages/listagem-docentes/listagem-docentes.component';
import { CadastroDocentesComponent } from './pages/cadastro-docentes/cadastro-docentes.component';
import { CadastroAlunosComponent } from './pages/cadastro-alunos/cadastro-alunos.component';
import { CadastroTurmasComponent } from './pages/cadastro-turmas/cadastro-turmas.component';
import { CadastroNotasComponent } from './pages/cadastro-notas/cadastro-notas.component';
import { ListagemNotasComponent } from './pages/listagem-notas/listagem-notas.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'cadastro-docentes',
    component: CadastroDocentesComponent,
  },
  {
    path: 'cadastro-alunos',
    component: CadastroAlunosComponent,
  },
  {
    path: 'cadastro-turma',
    component: CadastroTurmasComponent,
  },
  {
    path: 'cadastro-notas',
    component: CadastroNotasComponent,
  },
  {
    path: 'listagem-docentes',
    component: ListagemDocentesComponent,
  },
  {
    path: 'listagem-notas',
    component: ListagemNotasComponent,
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
