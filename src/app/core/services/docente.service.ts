import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DocenteInterface } from '../interfaces/docente.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocenteService {
  url = 'http://localhost:8080/docentes';

  constructor(private httpClient: HttpClient) {}

  getDocentes(): Observable<DocenteInterface[]> {
    return this.httpClient.get<Array<DocenteInterface>>(this.url);
  }

  getDocente(id: number): Observable<DocenteInterface> {
    return this.httpClient.get<DocenteInterface>(this.url + `/${id}`);
  }

  getDocenteByEmail(email: string): Observable<DocenteInterface[]> {
    return this.httpClient.get<Array<DocenteInterface>>(
      this.url + `?email=${email}`
    );
  }

  postDocente(docente: DocenteInterface): Observable<any> {
    return this.httpClient.post<any>(this.url, docente);
  }

  putDocente(docente: DocenteInterface): Observable<any> {
    return this.httpClient.put<any>(this.url + `/${docente.id}`, docente);
  }

  deleteDocente(docente: DocenteInterface): Observable<any> {
    return this.httpClient.delete<any>(this.url + `/${docente.id}`);
  }
}
