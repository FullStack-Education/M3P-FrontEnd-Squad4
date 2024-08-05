import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

import { UsuarioInterface } from '../../core/interfaces/usuario.interface';
import { AlunoInterface } from '../../core/interfaces/aluno.interface';
import { MateriaInterface } from '../../core/interfaces/materia.interface';
import { NotaInterface } from '../../core/interfaces/nota.interface';

import { LoginService } from '../../core/services/login.service';
import { DocenteService } from '../../core/services/docente.service';
import { AlunoService } from '../../core/services/aluno.service';
import { TurmaService } from '../../core/services/turma.service';
import { MateriaService } from '../../core/services/materia.service';
import { NotaService } from '../../core/services/nota.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  usuarioLogado: UsuarioInterface | null = null;
  perfilAtivo!: string;
  alunoAtivo!: AlunoInterface;
  listaNotas!: NotaInterface[];
  listaMaterias!: MateriaInterface[];
  listaAlunos!: AlunoInterface[];
  totalAlunos!: number;
  totalTurmas!: number;
  totalDocentes!: number;
  textoPesquisa!: string;

  constructor(
    private loginService: LoginService,
    private alunoService: AlunoService,
    private docenteService: DocenteService,
    private turmaService: TurmaService,
    private materiaService: MateriaService,
    private notaService: NotaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.perfilAtivo = this.loginService.perfilUsuarioAtivo;
    this.usuarioLogado = this.loginService.usuarioLogado;

    this.turmaService.getTurmas().subscribe((retorno) => {
      this.totalTurmas = retorno.length;
    });

    this.docenteService.getDocentes().subscribe((retorno) => {
      this.totalDocentes = retorno.length;
    });

    this.alunoService.getAlunos().subscribe((retorno) => {
      this.listaAlunos = retorno;
      this.totalAlunos = retorno.length;
    });

    this.alunoService
      .getAlunoByEmail(this.usuarioLogado.email)
      .subscribe((retorno) => {
        if (retorno.length > 0) this.alunoAtivo = retorno[0];

        if (this.alunoAtivo) {
          this.getNotasAluno();
        }
      });
  }

  pesquisar() {
    if (this.textoPesquisa) {
      this.alunoService.getAlunos().subscribe((retorno) => {
        this.listaAlunos = retorno.filter(
          (aluno) =>
            aluno.nomeCompleto
              .toUpperCase()
              .includes(this.textoPesquisa!.toUpperCase()) ||
            aluno.telefone
              .toUpperCase()
              .includes(this.textoPesquisa!.toUpperCase()) ||
            aluno.email
              .toUpperCase()
              .includes(this.textoPesquisa!.toUpperCase())
        );
      });
    } else {
      this.alunoService.getAlunos().subscribe((retorno) => {
        this.listaAlunos = retorno;
      });
    }
  }

  verDetalhes(idAluno: string) {
    this.router.navigate(['/aluno', idAluno]);
  }

  lancarNota(idAluno: string) {
    this.router.navigate(['/nota/aluno', idAluno]);
  }

  getNotasAluno() {
    this.notaService
      .getNotasByAluno(this.alunoAtivo.id)
      .subscribe((retorno) => {
        this.listaNotas = retorno;
        let idMaterias = retorno.map((item) => {
          return item.materia;
        });
        this.getMateriasAluno(idMaterias);
      });
  }

  getMateriasAluno(ids: Array<string>) {
    this.materiaService.getMaterias().subscribe((retorno) => {
      this.listaMaterias = retorno.filter((item) => {
        return ids.includes(item.id);
      });
    });
  }

  getNomeMaterias(idMateria: string) {
    let materia = this.listaMaterias.filter((item) => {
      return item.id == idMateria;
    });
    if (materia.length == 0) {
      return 'Matéria não encontrada!';
    }
    return materia[0].nome;
  }
}
