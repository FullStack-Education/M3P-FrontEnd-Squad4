import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CursoInterface } from '../interfaces/curso.interface';

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  url = 'http://localhost:8080/cursos';

  constructor(private httpClient: HttpClient) {}

  getCursos() {
    return this.httpClient.get<Array<CursoInterface>>(this.url);
  }

  getCurso(id: number) {
    return this.httpClient.get<CursoInterface>(this.url + `/${id}`);
  }

  getCursoByAluno(idAluno: number) {
    return this.httpClient.get<CursoInterface>(
      this.url + `/aluno/${idAluno}/curso`
    );
  }

  getCursosExtras(idAluno: number) {
    return this.httpClient.get<CursoInterface>(
      this.url + `/alunos/${idAluno}/cursos`
    );
  }
}
