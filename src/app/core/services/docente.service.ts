import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DocenteInterface } from '../interfaces/docente.interface';

@Injectable({
  providedIn: 'root',
})
export class DocenteService {
  url = 'http://localhost:3000/docentes';

  constructor(private httpClient: HttpClient) {}

  getDocentes() {
    return this.httpClient.get<Array<DocenteInterface>>(this.url);
  }

  getDocente(id: string) {
    return this.httpClient.get<DocenteInterface>(this.url + `/${id}`);
  }

  getDocenteByEmail(email: string) {
    return this.httpClient.get<Array<DocenteInterface>>(
      this.url + `?email=${email}`
    );
  }

  postDocente(docente: DocenteInterface) {
    return this.httpClient.post<any>(this.url, docente);
  }

  putDocente(docente: DocenteInterface) {
    return this.httpClient.put<any>(this.url + `/${docente.id}`, docente);
  }

  deleteDocente(docente: DocenteInterface) {
    return this.httpClient.delete<any>(this.url + `/${docente.id}`);
  }
}
