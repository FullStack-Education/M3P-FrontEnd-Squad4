import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DashboardInterface } from '../interfaces/dashboard';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  url = 'http://localhost:8080/dashboard';

  constructor(private httpClient: HttpClient) {}

  getEstatisticas() {
    return this.httpClient.get<DashboardInterface>(this.url);
  }
}