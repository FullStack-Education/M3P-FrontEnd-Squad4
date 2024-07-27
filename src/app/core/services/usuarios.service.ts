import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioInterface } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  url = 'http://localhost:3000/usuarios';

  constructor(private httpClient: HttpClient) {}

  getUsuarios() {
    return this.httpClient.get<Array<UsuarioInterface>>(this.url);
  }

  getUsuario(id: string) {
    return this.httpClient.get<UsuarioInterface>(this.url + `/${id}`);
  }
}
