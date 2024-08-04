import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MateriaInterface } from '../interfaces/materia.interface';

@Injectable({
  providedIn: 'root',
})
export class MateriaService {
  url = 'http://localhost:3000/materias';

  constructor(private httpClient: HttpClient) {}

  getMaterias() {
    return this.httpClient.get<Array<MateriaInterface>>(this.url);
  }

  getMateria(id: string) {
    return this.httpClient.get<MateriaInterface>(this.url + `/${id}`);
  }
}
