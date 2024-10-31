import { Injectable } from '@angular/core';
import { UsuarioInterface } from '../interfaces/usuario.interface';
import { UsuariosService } from './usuarios.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  usuarioLogado!: UsuarioInterface;
  perfilUsuarioAtivo!: string;
  private apiUrl = 'http://localhost:8080/login';

  constructor(
    private http: HttpClient,
    private router: Router,
    private usuariosService: UsuariosService
  ) {
    this.carregarUsuarioLogado();
  }

  logar(usuario: { email: string; senha: string }): Observable<boolean> {
    return this.http.post<{ accessToken?: string }>(this.apiUrl, usuario).pipe(
      switchMap((response) => {
        if (response && response.accessToken) {
          sessionStorage.setItem('token', response.accessToken);

          const decodedToken: any = jwtDecode(response.accessToken);
          const email = decodedToken.sub;

          return this.usuariosService.getUsuarioEmail(email).pipe(
            map((usuarioLogado) => {
              this.usuarioLogado = usuarioLogado;
              sessionStorage.setItem(
                'usuarioLogado',
                JSON.stringify(this.usuarioLogado)
              );
              return true;
            })
          );
        } else {
          return of(false);
        }
      }),
      catchError((error) => {
        console.error('Erro ao fazer login:', error);
        return of(false);
      })
    );
  }

  deslogar() {
    sessionStorage.removeItem('usuarioLogado');
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  private carregarUsuarioLogado() {
    const usuarioLogadoJson = sessionStorage.getItem('usuarioLogado');
    if (usuarioLogadoJson) {
      this.usuarioLogado = JSON.parse(usuarioLogadoJson);
      this.perfilUsuarioAtivo = this.usuarioLogado
        ? this.usuarioLogado.perfil
        : '';
    }
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }
}
