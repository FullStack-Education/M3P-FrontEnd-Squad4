import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotaInterface } from '../interfaces/nota.interface';

@Injectable({
  providedIn: 'root',
})
export class NotaService {
  url = 'http://localhost:3000/notas';

  constructor(private httpClient: HttpClient) {}

  getNotas() {
    return this.httpClient.get<Array<NotaInterface>>(this.url);
  }

  getNota(id: string) {
    return this.httpClient.get<NotaInterface>(this.url + `/${id}`);
  }

  getNotasByProfessor(idProfessor: string) {
    return this.httpClient.get<Array<NotaInterface>>(
      this.url + `?professor=${idProfessor}`
    );
  }

  getNotasByAluno(idAluno: string) {
    return this.httpClient.get<Array<NotaInterface>>(
      this.url + `?aluno=${idAluno}`
    );
  }

  postNota(nota: NotaInterface) {
    return this.httpClient.post<any>(this.url, nota);
  }

  putNota(nota: NotaInterface) {
    return this.httpClient.put<any>(this.url + `/${nota.id}`, nota);
  }

  deleteNota(nota: NotaInterface) {
    return this.httpClient.delete<any>(this.url + `/${nota.id}`);
  }
}
