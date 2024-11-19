import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DocenteInterface } from '../../core/interfaces/docente.interface';
import { DocenteService } from '../../core/services/docente.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listagem-docentes',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './listagem-docentes.component.html',
  styleUrl: './listagem-docentes.component.scss',
})
export class ListagemDocentesComponent implements OnInit {
  listaDocentes: DocenteInterface[] = [];
  textoPesquisa: string | undefined;

  constructor(private docenteService: DocenteService, private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.docenteService.getDocentes().subscribe({
      next: (retorno) => {
        this.listaDocentes = retorno;
      },
      error: (erro) => {
        this.toastr.error('Ocorreu um erro ao carregar a lista de docentes!');
        console.error(erro);
      },
    });
  }

  verDetalhes(idDocente: number) {
    this.router.navigate(['/docente', idDocente]);
  }

  pesquisar() {
    if (this.textoPesquisa) {
      const pesquisaId = Number(this.textoPesquisa);
      this.docenteService.getDocentes().subscribe({
        next: (retorno) => {
          this.listaDocentes = retorno.filter(
            (docente) =>
              docente.nomeCompleto
                .toUpperCase()
                .includes(this.textoPesquisa!.toUpperCase()) ||
              (!isNaN(pesquisaId) && docente.id === pesquisaId)
          );
        },
        error: (erro) => {
          this.toastr.error('Ocorreu um erro ao carregar a lista de docentes!');
          console.error(erro);
        },
      });
    } else {
      this.docenteService.getDocentes().subscribe({
        next: (retorno) => {
          this.listaDocentes = retorno;
        },
        error: (erro) => {
          this.toastr.error('Ocorreu um erro ao carregar a lista de docentes!');
          console.error(erro);
        },
      });
    }
  }
}
