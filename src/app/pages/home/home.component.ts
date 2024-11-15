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
import { ToastrService } from 'ngx-toastr';

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
  alunoAtivo: AlunoInterface | undefined;
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
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginService.usuarioLogado$.subscribe({
      next: (usuarioLogado) => {
        if (usuarioLogado) {
          this.perfilAtivo = usuarioLogado;
        }
      },
      error: (erro) => {
        this.toastr.error('Ocorreu um erro ao logar!');
        console.error(erro);
      },
    });

    if (this.perfilAtivo.papel === 'ADM') {
      this.carregarAlunos();
      this.dashboardService.getEstatisticas().subscribe({
        next: (retorno) => {
          this.totalTurmas = retorno.quantidadeDeTurmas;
          this.totalDocentes = retorno.quantidadeDeDocentes;
          this.totalAlunos = retorno.quantidadeDeAlunos;
        },
        error: (erro) => {
          this.toastr.error('Ocorreu um erro ao carregar estatísticas!');
          console.error(erro);
        },
      });
    } else {
      this.carregarAlunos();
    }
  }

  carregarAlunos() {
    if (this.perfilAtivo.papel === 'ALUNO') {
      this.alunoService.getAlunos().subscribe({
        next: (retorno) => {
          this.listaAlunos = retorno.filter((item) => {
            return item.email === this.perfilAtivo.email;
          });

          this.getCursoByAluno(this.listaAlunos[0].id);
          this.getCursosExtras(this.listaAlunos[0].id);
          this.getNotasAluno();
        },
        error: (erro) => {
          this.toastr.error('Ocorreu um erro ao buscar lista de docentes!');
          console.error(erro);
        },
      });
    } else {
      this.alunoService.getAlunos().subscribe({
        next: (retorno) => {
          this.listaAlunos = retorno;
        },
        error: (erro) => {
          this.toastr.error('Ocorreu um erro ao carregar alunos!');
          console.error(erro);
        },
      });
    }
  }

  getCursoByAluno(idAluno: number) {
    this.cursoService.getCursoByAluno(idAluno).subscribe({
      next: (retorno) => {
        this.cursoByAluno = retorno;
      },
      error: (erro) => {
        this.toastr.error('Ocorreu um erro ao carregar o curso do aluno!');
        console.error(erro);
      },
    });
  }

  getCursosExtras(idAluno: number) {
    this.cursoService.getCursosExtras(idAluno).subscribe({
      next: (retorno) => {
        this.cursosExtras = retorno;
      },
      error: (erro) => {
        this.toastr.error('Ocorreu um erro carregar os cursos extras!');
        console.error(erro);
      },
    });
  }

  pesquisar() {
    if (this.textoPesquisa) {
      this.alunoService.getAlunos().subscribe({
        next: (retorno) => {
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
        },
        error: (erro) => {
          this.toastr.error('Ocorreu um erro ao pesquisar!');
          console.error(erro);
        },
      });
    } else {
      this.alunoService.getAlunos().subscribe({
        next: (retorno) => {
          this.listaAlunos = retorno;
        },
        error: (erro) => {
          this.toastr.error('Ocorreu um erro carregar lista de alunos!');
          console.error(erro);
        },
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
    this.notaService.getNotasByAluno(this.listaAlunos[0].id).subscribe({
      next: (retorno) => {
        this.listaNotas = retorno;
        this.notasOrdenadasPorDataDesc();
        this.listaNotas = this.obterUltimasNotas(3);
        let idMaterias = retorno.map((item) => {
          return item.materia;
        });
        this.getMateriasAluno(idMaterias);
      },
      error: (erro) => {
        this.toastr.error('Ocorreu um erro ao carregar notas do aluno!');
        console.error(erro);
      },
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
    this.materiaService.getMaterias().subscribe({
      next: (retorno) => {
        const materiasFiltradas = retorno.filter((item) =>
          ids.includes(item.id)
        );
        this.listaMaterias = materiasFiltradas.slice(0, 3);
      },
      error: (erro) => {
        this.toastr.error('Ocorreu um erro ao carregar materias do aluno!');
        console.error(erro);
      },
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
