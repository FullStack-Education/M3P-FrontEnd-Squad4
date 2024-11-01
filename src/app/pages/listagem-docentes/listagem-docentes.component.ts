import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DocenteInterface } from '../../core/interfaces/docente.interface';
import { DocenteService } from '../../core/services/docente.service';

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

  constructor(private docenteService: DocenteService, private router: Router) {}

  ngOnInit(): void {
    this.docenteService.getDocentes().subscribe((retorno) => {
      this.listaDocentes = retorno;
    });
  }

  verDetalhes(idDocente: number) {
    this.router.navigate(['/docente', idDocente]);
  }

  pesquisar() {
    if (this.textoPesquisa) {
      const pesquisaId = Number(this.textoPesquisa);
      this.docenteService.getDocentes().subscribe((retorno) => {
        this.listaDocentes = retorno.filter(
          (docente) =>
            docente.nomeCompleto
              .toUpperCase()
              .includes(this.textoPesquisa!.toUpperCase()) ||
            (!isNaN(pesquisaId) && docente.id === pesquisaId)
        );
      });
    } else {
      this.docenteService.getDocentes().subscribe((retorno) => {
        this.listaDocentes = retorno;
      });
    }
  }
}
