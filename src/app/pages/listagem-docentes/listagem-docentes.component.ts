import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DocenteInterface } from '../../core/interfaces/docente.interface';
import { DocenteService } from '../../core/services/docente.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listagem-docentes',
  standalone: true,
  imports: [MatButtonModule, CommonModule, MatIconModule, FormsModule],
  templateUrl: './listagem-docentes.component.html',
  styleUrl: './listagem-docentes.component.scss',
})
export class ListagemDocentesComponent implements OnInit {
  listaDocentes: DocenteInterface[] = [];
  pesquisaDocentes: DocenteInterface[] = [];
  textoPesquisa: string | undefined;

  constructor(private docenteService: DocenteService, private router: Router) {}

  ngOnInit(): void {
    this.docenteService.getDocentes().subscribe((retorno) => {
      retorno.forEach((docente) => {
        this.listaDocentes.push(docente);
      });
      this.pesquisaDocentes = this.listaDocentes;
    });
  }

  verDetalhes(idDocente: string) {
    this.router.navigate(['/docente', idDocente]);
  }

  pesquisar() {
    if (this.textoPesquisa) {
      this.pesquisaDocentes = this.listaDocentes.filter(
        (docente) =>
          docente.nomeCompleto
            .toUpperCase()
            .includes(this.textoPesquisa!.toUpperCase()) ||
          docente.id.toUpperCase().includes(this.textoPesquisa!.toUpperCase())
      );
    } else {
      this.pesquisaDocentes = this.listaDocentes;
    }
  }
}
