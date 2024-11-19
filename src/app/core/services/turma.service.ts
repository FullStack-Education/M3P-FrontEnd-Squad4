import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TurmaInterface } from '../interfaces/turma.interface';
import { Observable } from 'rxjs';
import { DocenteInterface } from '../interfaces/docente.interface';
import { CursoInterface } from '../interfaces/curso.interface';

@Injectable({
  providedIn: 'root',
})
export class TurmaService {
  url = 'http://localhost:8080/turmas';

  constructor(private httpClient: HttpClient) {}

  getTurmas(): Observable<TurmaInterface[]> {
    return this.httpClient.get<Array<TurmaInterface>>(this.url);
  }

  getTurma(id: number): Observable<TurmaInterface> {
    return this.httpClient.get<TurmaInterface>(this.url + `/${id}`);
  }

  getTurmasByDocente(idDocente: number): Observable<TurmaInterface[]> {
    return this.httpClient.get<Array<TurmaInterface>>(
      `http://localhost:8080/docentes/${idDocente}/turmas`
    );
  }

  getTurmasByAluno(idAluno: number): Observable<TurmaInterface[]> {
    return this.httpClient.get<Array<TurmaInterface>>(
      this.url + `?aluno=${idAluno}`
    );
  }

  getDocentesByCurso(id: number): Observable<DocenteInterface[]> {
    return this.httpClient.get<Array<DocenteInterface>>(
      `http://localhost:8080/cursos/${id}/docentes`
    );
  }

  getCursosByDocente(idDocente: number): Observable<CursoInterface[]> {
    return this.httpClient.get<Array<CursoInterface>>(
      `http://localhost:8080/docentes/${idDocente}/cursos`
    );
  }

  postTurma(turma: TurmaInterface): Observable<any> {
    return this.httpClient.post<any>(this.url, turma);
  }
}
