import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { UsuarioInterface } from '../../core/interfaces/usuario.interface';
import { DocenteInterface } from '../../core/interfaces/docente.interface';
import { AlunoInterface } from '../../core/interfaces/aluno.interface';
import { TurmaInterface } from '../../core/interfaces/turma.interface';
import { MateriaInterface } from '../../core/interfaces/materia.interface';
import { NotaInterface } from '../../core/interfaces/nota.interface';
import { LoginService } from '../../core/services/login.service';
import { DocenteService } from '../../core/services/docente.service';
import { AlunoService } from '../../core/services/aluno.service';
import { TurmaService } from '../../core/services/turma.service';
import { MateriaService } from '../../core/services/materia.service';
import { NotaService } from '../../core/services/nota.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listagem-notas',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  templateUrl: './listagem-notas.component.html',
  styleUrl: './listagem-notas.component.scss',
})
export class ListagemNotasComponent implements OnInit {
  usuarioLogado!: UsuarioInterface;
  perfilAtivo!: UsuarioInterface;
  alunoAtivo: AlunoInterface | undefined;
  turmaByAluno: TurmaInterface | undefined;
  listaAlunos: AlunoInterface[] = [];
  listaDocentes: DocenteInterface[] = [];
  listaMaterias: MateriaInterface[] = [];
  listaNotas: NotaInterface[] = [];

  constructor(
    private loginService: LoginService,
    private docenteService: DocenteService,
    private alunoService: AlunoService,
    private turmaService: TurmaService,
    private materiaService: MateriaService,
    private notaService: NotaService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loginService.usuarioLogado$.subscribe((usuarioLogado) => {
      if (usuarioLogado) {
        this.perfilAtivo = usuarioLogado;
      }
    });

    this.docenteService.getDocentes().subscribe((retorno) => {
      this.listaDocentes = retorno;
    });

    this.alunoService.getAlunos().subscribe({
      next: (retorno) => {
        this.alunoAtivo = retorno.find((item) => {
          return item.email === this.perfilAtivo.email;
        });
        if (this.alunoAtivo !== undefined) {
          this.getTurmaAluno(this.alunoAtivo.turma);
          this.getNotasAluno();
        }
      },
      error: (erro) => {
        this.toastr.error('Aluno não encontrado!');
        console.error(erro);
      },
    });
  }

  getTurmaAluno(idTurma: number) {
    this.turmaService.getTurma(idTurma).subscribe((retorno) => {
      this.turmaByAluno = retorno;
      if (this.turmaByAluno.id !== undefined) {
        this.getNomeDocenteTurma(this.turmaByAluno.docenteId);
      }
    });
  }

  getNomeDocenteTurma(idDocente: any) {
    let docente = this.listaDocentes.filter((item) => {
      return item.id == idDocente;
    });
    if (docente.length == 0) {
      return 'Docente não encontrado!';
    }
    return docente[0].nomeCompleto;
  }

  getNotasAluno() {
    this.notaService
      .getNotasByAluno(this.alunoAtivo?.id)
      .subscribe((retorno) => {
        this.listaNotas = retorno;
        this.ordenarNotasPorDataAsc();
        let idMaterias = retorno.map((item) => {
          return item.materia;
        });
        this.getMateriasAluno(idMaterias);
      });
  }

  ordenarNotasPorDataAsc() {
    this.listaNotas.sort((a, b) => {
      return new Date(a.data).getTime() - new Date(b.data).getTime();
    });
  }

  getMateriasAluno(ids: Array<number>) {
    this.materiaService.getMaterias().subscribe((retorno) => {
      this.listaMaterias = retorno.filter((item) => {
        return ids.includes(item.id);
      });
    });
  }

  getNomeMaterias(idMateria: number) {
    let materia = this.listaMaterias.filter((item) => {
      return item.id == idMateria;
    });
    if (materia.length == 0) {
      return 'Matéria não encontrada!';
    }
    return materia[0].nome;
  }
}
