import { Injectable } from '@angular/core';
import { UsuarioInterface } from '../interfaces/usuario.interface';
import { UsuariosService } from './usuarios.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  usuarioLogado: UsuarioInterface | null = null;
  listaUsuarios: Array<UsuarioInterface> = [];
  perfilUsuarioAtivo!: string;

  constructor(private usuariosService: UsuariosService) {
    this.obterUsuarios();
    this.carregarUsuarioLogado();
  }

  logar(usuario: { email: string; senha: string }): boolean {
    const matchUser = this.listaUsuarios.find(
      (user) => user.email === usuario.email && user.senha === usuario.senha
    );

    if (matchUser) {
      this.usuarioLogado = matchUser;
      this.perfilUsuarioAtivo = matchUser.perfil;
      sessionStorage.setItem(
        'usuarioLogado',
        JSON.stringify(this.usuarioLogado)
      );

      return true;
    } else {
      return false;
    }
  }

  deslogar() {
    sessionStorage.removeItem('usuarioLogado');
  }

  private carregarUsuarioLogado() {
    const usuarioLogadoJson = sessionStorage.getItem('usuarioLogado');
    if (usuarioLogadoJson) {
      this.usuarioLogado = JSON.parse(usuarioLogadoJson);
      if (this.usuarioLogado) {
        this.perfilUsuarioAtivo = this.usuarioLogado.perfil;
      }
    }
  }

  private obterUsuarios() {
    this.usuariosService.getUsuarios().subscribe((retorno) => {
      retorno.forEach((usuario) => {
        this.listaUsuarios.push(usuario);
      });
    });
  }
}
