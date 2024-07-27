import { Injectable } from '@angular/core';
import { UsuarioInterface } from '../interfaces/usuario.interface';
import { UsuariosService } from './usuarios.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  usuarioLogado: UsuarioInterface | null = null;
  listaUsuarios: Array<UsuarioInterface> = [];

  constructor(private usuariosService: UsuariosService) {
    this.obterUsuarios();
  }

  logar(usuario: { email: string; senha: string }): boolean {
    const matchUser = this.listaUsuarios.find(
      (user) => user.email === usuario.email && user.senha === usuario.senha
    );

    if (matchUser) {
      this.usuarioLogado = matchUser;
      sessionStorage.setItem(
        'usuarioLogado',
        JSON.stringify(this.usuarioLogado)
      );
      window.alert('Usuário logado com sucesso!');
      return true;
    } else {
      window.alert('Usuário ou senha incorretos!');
      return false;
    }
  }

  deslogar() {
    sessionStorage.removeItem('usuarioLogado');
  }

  private obterUsuarios() {
    this.usuariosService.getUsuarios().subscribe((retorno) => {
      retorno.forEach((usuario) => {
        this.listaUsuarios.push(usuario);
      });
    });
  }
}
