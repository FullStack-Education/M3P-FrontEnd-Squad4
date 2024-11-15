import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CursoInterface } from '../interfaces/curso.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  url = 'http://localhost:8080/cursos';

  constructor(private httpClient: HttpClient) {}

  getCursos(): Observable<CursoInterface[]> {
    return this.httpClient.get<Array<CursoInterface>>(this.url);
  }

  getCurso(id: number): Observable<CursoInterface> {
    return this.httpClient.get<CursoInterface>(this.url + `/${id}`);
  }

  getCursoByAluno(idAluno: number): Observable<CursoInterface> {
    return this.httpClient.get<CursoInterface>(
      this.url + `?idAluno=${idAluno}`
    );
  }

  getCursosExtras(idAluno: number): Observable<CursoInterface> {
    return this.httpClient.get<CursoInterface>(
      `http://localhost:8080/alunos/${idAluno}/cursos`
    );
  }
}
