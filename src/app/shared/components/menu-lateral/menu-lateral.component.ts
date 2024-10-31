import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  MatListItem,
  MatListItemIcon,
  MatListItemTitle,
  MatNavList,
} from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ItemMenuInterface } from '../../../core/interfaces/item-menu.interface';
import { LoginService } from '../../../core/services/login.service';
import { DialogComponent } from '../dialog/dialog.component';
import { SidenavService } from '../../../core/services/sidenav.service';

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
    MatButtonModule,
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
      perfis: ['ADM', 'PROFESSOR', 'ALUNO'],
    },
    {
      rotulo: 'Cadastro de Docente',
      icone: 'person',
      rota: '/docente',
      perfis: ['ADM'],
    },
    {
      rotulo: 'Cadastro de Aluno',
      icone: 'school',
      rota: '/aluno',
      perfis: ['ADM'],
    },
    {
      rotulo: 'Cadastro de Turma',
      icone: 'groups',
      rota: '/turma',
      perfis: ['ADM', 'PROFESSOR'],
    },
    {
      rotulo: 'Cadastro de Avaliação',
      icone: 'verified',
      rota: '/nota',
      perfis: ['ADM', 'PROFESSOR'],
    },
    {
      rotulo: 'Listagem de Docentes',
      icone: 'group',
      rota: '/docentes',
      perfis: ['ADM'],
    },
    {
      rotulo: 'Listagem de Notas',
      icone: 'article',
      rota: '/notas',
      perfis: ['ALUNO'],
    },
  ];

  perfilAtivo!: string;

  constructor(
    private loginService: LoginService,
    private dialog: MatDialog,
    private router: Router,
    private sidenavService: SidenavService
  ) {}

  ngOnInit(): void {
    this.perfilAtivo = this.loginService.perfilUsuarioAtivo;

    this.itensMenuFiltrado = this.itensMenu.filter((item) => {
      return this.validarPermissao(item);
    });
  }

  validarPermissao(item: ItemMenuInterface): boolean {
    return item.perfis.includes(this.perfilAtivo);
  }

  closeSidenav() {
    if (
      this.sidenavService.sidenavMode === 'over' ||
      this.sidenavService.sidenavMode === 'push'
    ) {
      this.sidenavService.close();
    }
  }

  sair() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        titulo: 'Sair do Sistema',
        mensagem: 'Você tem certeza que deseja sair do sistema?',
        btConfirmar: 'Confirmar',
        btCancelar: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((retorno) => {
      if (retorno) {
        this.loginService.deslogar();
        this.router.navigate(['/login']);
      } else {
        return;
      }
    });
  }
}
