import { Injectable } from '@angular/core';
import { UsuarioInterface } from '../interfaces/usuario.interface';
import { UsuariosService } from './usuarios.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  catchError,
  map,
  Observable,
  of,
  switchMap,
  BehaviorSubject,
} from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:8080/login';
  private usuarioLogadoSubject = new BehaviorSubject<UsuarioInterface | null>(
    null
  );
  public usuarioLogado$ = this.usuarioLogadoSubject.asObservable();
  private perfilUsuarioAtivo!: string;

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
              this.usuarioLogadoSubject.next(usuarioLogado);
              sessionStorage.setItem(
                'usuarioLogado',
                JSON.stringify(usuarioLogado)
              );
              this.perfilUsuarioAtivo = usuarioLogado.papel;
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
    this.usuarioLogadoSubject.next(null);
    this.router.navigate(['/login']);
  }

  private carregarUsuarioLogado() {
    const usuarioLogadoJson = sessionStorage.getItem('usuarioLogado');
    if (usuarioLogadoJson) {
      const usuarioLogado = JSON.parse(usuarioLogadoJson) as UsuarioInterface;
      this.usuarioLogadoSubject.next(usuarioLogado);
      this.perfilUsuarioAtivo = usuarioLogado.papel;
    }
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  get perfilAtual(): string {
    return this.perfilUsuarioAtivo;
  }
}
