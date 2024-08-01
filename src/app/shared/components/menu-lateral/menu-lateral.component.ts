import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../core/services/login.service';
import { Router, RouterModule } from '@angular/router';
import { ItemMenuInterface } from '../../../core/interfaces/item-menu.interface';
import { CommonModule } from '@angular/common';
import {
  MatListItem,
  MatListItemIcon,
  MatListItemTitle,
  MatListModule,
  MatNavList,
} from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-menu-lateral',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatNavList,
    MatListItem,
    MatIconModule,
    MatListItemIcon,
    MatListItemTitle,
  ],
  templateUrl: './menu-lateral.component.html',
  styleUrl: './menu-lateral.component.scss',
})
export class MenuLateralComponent implements OnInit {
  itensMenuFiltrado: ItemMenuInterface[] = [];
  itensMenu: ItemMenuInterface[] = [
    {
      rotulo: 'Dashboard',
      icone: 'dashboard',
      rota: '/home',
      perfis: ['admin', 'docente', 'aluno'],
    },
    {
      rotulo: 'Cadastro de Docente',
      icone: 'person',
      rota: '/cadastro-docentes',
      perfis: ['admin'],
    },
    {
      rotulo: 'Cadastro de Aluno',
      icone: 'school',
      rota: '/cadastro-alunos',
      perfis: ['admin'],
    },
    {
      rotulo: 'Cadastro de Turma',
      icone: 'groups',
      rota: '/cadastro-turmas',
      perfis: ['admin', 'docente'],
    },
    {
      rotulo: 'Cadastro de Avaliação',
      icone: 'verified',
      rota: '/cadastro-notas',
      perfis: ['admin', 'docente'],
    },
    {
      rotulo: 'Listagem de Docentes',
      icone: 'group',
      rota: '/listagem-docentes',
      perfis: ['admin'],
    },
    {
      rotulo: 'Listagem de Notas',
      icone: 'article',
      rota: '/listagem-notas',
      perfis: ['aluno'],
    },
  ];

  perfilAtivo!: string;

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.perfilAtivo = this.loginService.perfilUsuarioAtivo;

    this.itensMenuFiltrado = this.itensMenu.filter((item) => {
      return this.validarPermissao(item);
    });
  }

  validarPermissao(item: ItemMenuInterface): boolean {
    return item.perfis.includes(this.perfilAtivo);
  }

  sair() {
    if (window.confirm('Deseja sair do sistema?')) {
      this.loginService.deslogar();
      this.router.navigate(['/login']);
    } else {
      return;
    }
  }
}
