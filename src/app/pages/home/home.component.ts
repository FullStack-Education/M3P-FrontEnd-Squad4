import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { UsuarioInterface } from '../../core/interfaces/usuario.interface';
import { AlunoInterface } from '../../core/interfaces/aluno.interface';
import { MateriaInterface } from '../../core/interfaces/materia.interface';
import { NotaInterface } from '../../core/interfaces/nota.interface';
import { LoginService } from '../../core/services/login.service';
import { AlunoService } from '../../core/services/aluno.service';
import { MateriaService } from '../../core/services/materia.service';
import { NotaService } from '../../core/services/nota.service';
import { MatIconModule } from '@angular/material/icon';
import { IdadePipe } from '../../core/pipes/idade.pipe';
import { DashboardService } from '../../core/services/dashboard.service';
import { CursoInterface } from '../../core/interfaces/curso.interface';
import { CursoService } from '../../core/services/curso.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    RouterModule,
    IdadePipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  usuarioLogado!: UsuarioInterface;
  perfilAtivo!: UsuarioInterface;
  alunoByEmail: AlunoInterface | undefined;
  cursoByAluno: CursoInterface | undefined;
  cursosExtras: any;
  listaNotas: NotaInterface[] = [];
  listaMaterias: MateriaInterface[] = [];
  listaAlunos: AlunoInterface[] = [];
  totalAlunos!: number;
  totalTurmas!: number;
  totalDocentes!: number;
  textoPesquisa!: string;

  constructor(
    private loginService: LoginService,
    private alunoService: AlunoService,
    private dashboardService: DashboardService,
    private materiaService: MateriaService,
    private cursoService: CursoService,
    private notaService: NotaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginService.usuarioLogado$.subscribe((usuarioLogado) => {
      if (usuarioLogado) {
        this.perfilAtivo = usuarioLogado;
      }
    });

    if (this.perfilAtivo.papel === 'ADM') {
      this.alunoService.getAlunos().subscribe((retorno) => {
        this.listaAlunos = retorno;
      });
      this.dashboardService.getEstatisticas().subscribe((retorno) => {
        this.totalTurmas = retorno.quantidadeDeTurmas;
        this.totalDocentes = retorno.quantidadeDeDocentes;
        this.totalAlunos = retorno.quantidadeDeAlunos;
      });
    }

    if (this.perfilAtivo.papel === 'ALUNO') {
      let idAluno = this.alunoByEmail?.id;
      this.alunoService
        .getAlunoByEmail(this.perfilAtivo.email)
        .subscribe((retorno) => {
          this.listaAlunos = retorno;
          this.alunoByEmail = retorno.find((item) => {
            return item.email === this.perfilAtivo.email;
          });
          idAluno = this.alunoByEmail?.id;

          if (idAluno !== undefined) {
            this.getCursoByAluno(idAluno);
            this.getCursosExtras(idAluno);
            this.getNotasAluno();
          }
        });
    }
  }

  getCursoByAluno(idAluno: number) {
    this.cursoService.getCursoByAluno(idAluno).subscribe((retorno) => {
      this.cursoByAluno = retorno;
    });
  }

  getCursosExtras(idAluno: number) {
    this.cursoService.getCursosExtras(idAluno).subscribe((retorno) => {
      this.cursosExtras = retorno;
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

  verDetalhes(idAluno: number) {
    this.router.navigate(['/aluno', idAluno]);
  }

  lancarNota(idAluno: number) {
    this.router.navigate(['/nota/aluno', idAluno]);
  }

  getNotasAluno() {
    this.notaService
      .getNotasByAluno(this.alunoByEmail?.id)
      .subscribe((retorno) => {
        this.listaNotas = retorno;
        this.notasOrdenadasPorDataDesc();
        this.listaNotas = this.obterUltimasNotas(3);
        let idMaterias = retorno.map((item) => {
          return item.materia;
        });
        this.getMateriasAluno(idMaterias);
      });
  }

  notasOrdenadasPorDataDesc() {
    this.listaNotas.sort((a, b) => {
      return new Date(b.data).getTime() - new Date(a.data).getTime();
    });
  }

  obterUltimasNotas(n: number): any[] {
    return this.listaNotas.slice(0, n);
  }

  getMateriasAluno(ids: Array<number>) {
    this.materiaService.getMaterias().subscribe((retorno) => {
      const materiasFiltradas = retorno.filter((item) => ids.includes(item.id));
      this.listaMaterias = materiasFiltradas.slice(0, 3);
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
