import { Component, OnInit } from '@angular/core';
import { UsuarioInterface } from '../../../core/interfaces/usuario.interface';
import { LoginService } from '../../../core/services/login.service';
import { NavigationEnd, Router } from '@angular/router';
import { ItemMenuInterface } from '../../../core/interfaces/item-menu.interface';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent implements OnInit {
  paginas = [
    { titulo: 'Dashboard', rota: '/home' },
    { titulo: 'Cadastro de Docente', rota: '/cadastro-docentes' },
    { titulo: 'Cadastro de Aluno', rota: '/cadastro-alunos' },
    { titulo: 'Cadastro de Turma', rota: '/cadastro-turmas' },
    { titulo: 'Cadastro de Avaliação', rota: '/cadastro-notas' },
    { titulo: 'Listagem de Docentes', rota: '/listagem-docentes' },
    { titulo: 'Listagem de Notas', rota: '/listagem-notas' },
  ];

  pagina = '';

  usuarioAtivo = {
    nome: '',
    avatar: '',
  };

  constructor(private loginService: LoginService, private router: Router) {
    this.router.events.subscribe((evento) => {
      if (evento instanceof NavigationEnd) {
        this.atualizarTitulo(evento.urlAfterRedirects);
      }
    });
  }

  ngOnInit(): void {
    const usuarioLogado = this.loginService.usuarioLogado;
    if (usuarioLogado) {
      this.usuarioAtivo.nome = usuarioLogado.nome;
      this.usuarioAtivo.avatar = usuarioLogado.avatar;
    }
    this.atualizarTitulo(this.router.url);
  }

  atualizarTitulo(url: string): void {
    const paginaEncontrada = this.paginas.find((pagina) => pagina.rota === url);
    if (paginaEncontrada) {
      this.pagina = paginaEncontrada.titulo;
    } else {
      this.pagina = 'Página não encontrada';
    }
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
