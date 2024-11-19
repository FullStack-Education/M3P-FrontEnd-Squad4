import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MateriaInterface } from '../interfaces/materia.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MateriaService {
  url = 'http://localhost:8080/materias';

  constructor(private httpClient: HttpClient) {}

  getMaterias(): Observable<MateriaInterface[]> {
    return this.httpClient.get<Array<MateriaInterface>>(this.url);
  }

  getMateria(id: number): Observable<MateriaInterface> {
    return this.httpClient.get<MateriaInterface>(this.url + `/${id}`);
  }

  getMateriasByDocente(idDocente: number): Observable<MateriaInterface[]> {
    return this.httpClient.get<Array<MateriaInterface>>(
      `http://localhost:8080/docentes/${idDocente}/materias`
    );
  }
}
