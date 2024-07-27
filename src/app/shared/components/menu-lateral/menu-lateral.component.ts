import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../core/services/login.service';
import { Router, RouterModule } from '@angular/router';
import { ItemMenuInterface } from '../../../core/interfaces/item-menu.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-lateral',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './menu-lateral.component.html',
  styleUrl: './menu-lateral.component.scss',
})
export class MenuLateralComponent implements OnInit {
  itensMenu: ItemMenuInterface[] = [
    {
      rotulo: 'Dashboard',
      rota: '/home',
      perfis: ['admin', 'docente', 'aluno'],
    },
    {
      rotulo: 'Cadastro de Docente',
      rota: '/cadastro-docentes',
      perfis: ['admin'],
    },
    {
      rotulo: 'Cadastro de Aluno',
      rota: '/cadastro-alunos',
      perfis: ['admin'],
    },
    {
      rotulo: 'Cadastro de Turma',
      rota: '/cadastro-turmas',
      perfis: ['admin', 'docente'],
    },
    {
      rotulo: 'Cadastro de Avaliação',
      rota: '/cadastro-notas',
      perfis: ['admin', 'docente'],
    },
    {
      rotulo: 'Listagem de Docentes',
      rota: '/listagem-docentes',
      perfis: ['admin'],
    },
    { rotulo: 'Listagem de Notas', rota: '/listagem-notas', perfis: ['aluno'] },
  ];

  perfilAtivo!: string;

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.perfilAtivo = this.loginService.perfilUsuarioAtivo;
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
