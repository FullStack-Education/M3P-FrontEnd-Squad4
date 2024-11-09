import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlunoInterface } from '../interfaces/aluno.interface';

@Injectable({
  providedIn: 'root',
})
export class AlunoService {
  url = 'http://localhost:8080/alunos';

  constructor(private httpClient: HttpClient) {}

  getAlunos() {
    return this.httpClient.get<Array<AlunoInterface>>(this.url);
  }

  getAluno(id: number) {
    return this.httpClient.get<AlunoInterface>(this.url + `/${id}`);
  }

  getAlunoByEmail(email: string) {
    return this.httpClient.get<Array<AlunoInterface>>(
      this.url + `?email=${email}`
    );
  }

  getAlunosByTurma(idTurma: number) {
    return this.httpClient.get<Array<AlunoInterface>>(
      this.url + `/turmas/${idTurma}/alunos`
    );
  }

  postAluno(aluno: AlunoInterface) {
    return this.httpClient.post<any>(this.url, aluno);
  }

  putAluno(aluno: AlunoInterface) {
    return this.httpClient.put<any>(this.url + `/${aluno.id}`, aluno);
  }

  deleteAluno(aluno: AlunoInterface) {
    return this.httpClient.delete<any>(this.url + `/${aluno.id}`);
  }
}
