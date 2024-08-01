import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../core/services/login.service';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { SidenavService } from '../../../core/services/sidenav.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent implements OnInit {
  usuarioAtivo = {
    nome: '',
    avatar: '',
  };

  constructor(
    private loginService: LoginService,
    private router: Router,
    private sidenavService: SidenavService
  ) {}

  ngOnInit(): void {
    const usuarioLogado = this.loginService.usuarioLogado;
    if (usuarioLogado) {
      this.usuarioAtivo.nome = usuarioLogado.nome;
      this.usuarioAtivo.avatar = usuarioLogado.avatar;
    }
  }

  toggleSidenav(): void {
    this.sidenavService.toggle();
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
