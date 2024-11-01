import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioInterface } from '../interfaces/usuario.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  url = 'http://localhost:8080/usuarios';

  constructor(private httpClient: HttpClient) {}

  getUsuarios() {
    return this.httpClient.get<Array<UsuarioInterface>>(this.url);
  }

  getUsuario(id: string) {
    return this.httpClient.get<UsuarioInterface>(this.url + `/${id}`);
  }

  getUsuarioEmail(email: string): Observable<UsuarioInterface> {
    return this.httpClient.get<UsuarioInterface>(
      this.url + `/buscar?email=${email}`
    );
  }
}
