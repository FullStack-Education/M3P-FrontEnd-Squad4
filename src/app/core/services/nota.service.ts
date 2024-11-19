import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotaInterface } from '../interfaces/nota.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotaService {
  url = 'http://localhost:8080/notas';

  constructor(private httpClient: HttpClient) {}

  getNotas(): Observable<NotaInterface[]> {
    return this.httpClient.get<Array<NotaInterface>>(this.url);
  }

  getNota(id: number): Observable<NotaInterface> {
    return this.httpClient.get<NotaInterface>(this.url + `/${id}`);
  }

  getNotasByDocente(idDocente: number): Observable<NotaInterface[]> {
    return this.httpClient.get<Array<NotaInterface>>(
      this.url + `?docente=${idDocente}`
    );
  }

  getNotasByAluno(idAluno: any): Observable<NotaInterface[]> {
    return this.httpClient.get<Array<NotaInterface>>(
      `http://localhost:8080/alunos/${idAluno}/notas`
    );
  }

  postNota(nota: NotaInterface): Observable<any> {
    return this.httpClient.post<any>(this.url, nota);
  }
}
