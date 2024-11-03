import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TurmaInterface } from '../interfaces/turma.interface';

@Injectable({
  providedIn: 'root',
})
export class TurmaService {
  url = 'http://localhost:8080/turmas';

  constructor(private httpClient: HttpClient) {}

  getTurmas() {
    return this.httpClient.get<Array<TurmaInterface>>(this.url);
  }

  getTurma(id: number) {
    return this.httpClient.get<TurmaInterface>(this.url + `/${id}`);
  }

  getTurmasByProfessor(idProfessor: number) {
    return this.httpClient.get<Array<TurmaInterface>>(
      this.url + `?professor=${idProfessor}`
    );
  }

  getTurmasByAluno(idAluno: number) {
    return this.httpClient.get<Array<TurmaInterface>>(
      this.url + `?aluno=${idAluno}`
    );
  }

  postTurma(turma: TurmaInterface) {
    return this.httpClient.post<any>(this.url, turma);
  }
}
