import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CepService {
  url = 'https://viacep.com.br/ws/[cep]/json/';

  constructor(private httpClient: HttpClient) {}

  buscarCep(cep: string) {
    return this.httpClient.get(this.url.replace('[cep]', cep));
  }
}
