import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotaInterface } from '../interfaces/nota.interface';

@Injectable({
  providedIn: 'root',
})
export class NotaService {
  url = 'http://localhost:8080/notas';

  constructor(private httpClient: HttpClient) {}

  getNotas() {
    return this.httpClient.get<Array<NotaInterface>>(this.url);
  }

  getNota(id: number) {
    return this.httpClient.get<NotaInterface>(this.url + `/${id}`);
  }

  getNotasByDocente(idDocente: number) {
    return this.httpClient.get<Array<NotaInterface>>(
      this.url + `?docente=${idDocente}`
    );
  }

  getNotasByAluno(idAluno: number) {
    return this.httpClient.get<Array<NotaInterface>>(
      this.url + `?aluno=${idAluno}`
    );
  }

  postNota(nota: NotaInterface) {
    return this.httpClient.post<any>(this.url, nota);
  }
}
