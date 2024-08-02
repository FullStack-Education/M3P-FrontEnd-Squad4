import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { LoginService } from '../../core/services/login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  perfilAtivo!: string;

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.perfilAtivo = this.loginService.perfilUsuarioAtivo;
  }

  pesquisar() {}

  verDetalhes() {}

  lancarNota() {}
}
