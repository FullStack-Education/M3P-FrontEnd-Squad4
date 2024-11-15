import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlunoInterface } from '../interfaces/aluno.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlunoService {
  url = 'http://localhost:8080/alunos';

  constructor(private httpClient: HttpClient) {}

  getAlunos(): Observable<AlunoInterface[]> {
    return this.httpClient.get<Array<AlunoInterface>>(this.url);
  }

  getAluno(id: number): Observable<AlunoInterface> {
    return this.httpClient.get<AlunoInterface>(this.url + `/${id}`);
  }

  getAlunoByEmail(email: string): Observable<AlunoInterface[]> {
    return this.httpClient.get<Array<AlunoInterface>>(
      this.url + `?email=${email}`
    );
  }

  getAlunosByTurma(idTurma: number): Observable<AlunoInterface[]> {
    return this.httpClient.get<Array<AlunoInterface>>(
      `http://localhost:8080/turmas/${idTurma}/alunos`
    );
  }

  postAluno(aluno: AlunoInterface): Observable<any> {
    return this.httpClient.post<any>(this.url, aluno);
  }

  putAluno(aluno: AlunoInterface): Observable<any> {
    return this.httpClient.put<any>(this.url + `/${aluno.id}`, aluno);
  }

  deleteAluno(aluno: AlunoInterface): Observable<any> {
    return this.httpClient.delete<any>(this.url + `/${aluno.id}`);
  }
}
