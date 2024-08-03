import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TurmaInterface } from '../interfaces/turma.interface';

@Injectable({
  providedIn: 'root',
})
export class TurmaService {
  url = 'http://localhost:3000/turmas';

  constructor(private httpClient: HttpClient) {}

  getTurmas() {
    return this.httpClient.get<Array<TurmaInterface>>(this.url);
  }

  getTurma(id: string) {
    return this.httpClient.get<TurmaInterface>(this.url + `/${id}`);
  }

  postTurma(turma: TurmaInterface) {
    return this.httpClient.post<any>(this.url, turma);
  }

  putTurma(turma: TurmaInterface) {
    return this.httpClient.put<any>(this.url + `/${turma.id}`, turma);
  }

  deleteTurma(turma: TurmaInterface) {
    return this.httpClient.delete<any>(this.url + `/${turma.id}`);
  }
}
