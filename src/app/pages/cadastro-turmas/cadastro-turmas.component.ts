import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioInterface } from '../../core/interfaces/usuario.interface';
import { DocenteInterface } from '../../core/interfaces/docente.interface';
import { TurmaInterface } from '../../core/interfaces/turma.interface';
import { CursoInterface } from '../../core/interfaces/curso.interface';
import { LoginService } from '../../core/services/login.service';
import { DocenteService } from '../../core/services/docente.service';
import { TurmaService } from '../../core/services/turma.service';
import { ErroFormComponent } from '../../shared/components/erro-form/erro-form.component';
import { CursoService } from '../../core/services/curso.service';
import { MateriaInterface } from '../../core/interfaces/materia.interface';

@Component({
  selector: 'app-cadastro-turmas',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    NgSelectModule,
    MatIconModule,
    ErroFormComponent,
    CommonModule,
  ],
  templateUrl: './cadastro-turmas.component.html',
  styleUrl: './cadastro-turmas.component.scss',
})
export class CadastroTurmasComponent {
  perfilAtivo!: UsuarioInterface;
  formTurma!: FormGroup;
  idTurma: number | undefined;
  listaDocentes: DocenteInterface[] = [];
  listaCursos: CursoInterface[] = [];
  listaMaterias: MateriaInterface[] = [];

  dataRegex = /^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private activatedRoute: ActivatedRoute,
    private turmaService: TurmaService,
    private cursoService: CursoService,
    private docenteService: DocenteService,
    private toastr: ToastrService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loginService.usuarioLogado$.subscribe({
      next: (usuarioLogado) => {
        if (usuarioLogado) {
          this.perfilAtivo = usuarioLogado;
          this.inicializaForm();
        }
      },
      error: (erro) => {
        this.toastr.error('Ocorreu um erro ao logar!');
        console.error(erro);
      },
    });

    this.idTurma = this.activatedRoute.snapshot.params['id'];
  }

  inicializaForm() {
    this.formTurma = new FormGroup({
      nomeTurma: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
      ]),
      dataInicio: new FormControl('', [
        Validators.required,
        Validators.pattern(this.dataRegex),
      ]),
      dataTermino: new FormControl('', [
        Validators.required,
        Validators.pattern(this.dataRegex),
      ]),
      horario: new FormControl('', Validators.required),
      docenteId: new FormControl('', Validators.required),
      cursoId: new FormControl('', Validators.required),
    });

    const now = new Date();
    const dataFormatada = now.toISOString().split('T')[0];
    const horaFormatada = now.toTimeString().split(' ')[0].slice(0, 5);
    this.formTurma.get('dataInicio')?.setValue(dataFormatada);
    this.formTurma.get('dataTermino')?.setValue(dataFormatada);
    this.formTurma.get('horario')?.setValue(horaFormatada);

    this.carregarCursos();
  }

  carregarCursos() {
    if (this.perfilAtivo.papel === 'PROFESSOR') {
      this.docenteService.getDocentes().subscribe({
        next: (retorno) => {
          this.listaDocentes = retorno.filter((item) => {
            return item.email === this.perfilAtivo.email;
          });
          this.getCursosByDocente(this.listaDocentes[0].id);
        },
        error: (erro) => {
          this.toastr.error('Ocorreu um erro ao buscar lista de docentes!');
          console.error(erro);
        },
      });
    } else {
      this.cursoService.getCursos().subscribe({
        next: (retorno) => {
          this.listaCursos = retorno;
        },
        error: (erro) => {
          this.toastr.error('Ocorreu um erro ao buscar lista de cursos!');
          console.error(erro);
        },
      });
    }

    if (this.idTurma) {
      this.turmaService.getTurma(this.idTurma).subscribe({
        next: (retorno) => {
          this.formTurma.disable();
          this.formTurma.patchValue(retorno);
        },
        error: (erro) => {
          this.toastr.error('Ocorreu um erro ao carregar os dados da turma!');
          console.error(erro);
        },
      });
    }
  }

  getDocentesByCurso(idCurso: number) {
    this.formTurma.patchValue({
      docenteId: '',
    });

    this.listaDocentes = [];

    this.turmaService.getDocentesByCurso(idCurso).subscribe({
      next: (retorno) => {
        this.listaDocentes = retorno;
      },
      error: (erro) => {
        this.toastr.error('Não há docentes cadastrados neste curso!');
        console.error(erro);
      },
    });
  }

  getCursosByDocente(idDocente: number) {
    this.turmaService.getCursosByDocente(idDocente).subscribe({
      next: (retorno) => {
        this.listaCursos = retorno;
      },
      error: (erro) => {
        this.toastr.error('Não há cursos cadastrados para este docente!');
        console.error(erro);
      },
    });
  }

  submitForm() {
    if (this.formTurma.valid) {
      this.cadastrarTurma(this.formTurma.value);
    } else {
      this.formTurma.markAllAsTouched();
    }
  }

  cadastrarTurma(turma: TurmaInterface) {
    this.turmaService.postTurma(turma).subscribe({
      next: () => {
        this.toastr.success('Turma cadastrada com sucesso!');
        this.router.navigate(['/home']);
      },
      error: (erro) => {
        this.toastr.error('Ocorreu um erro ao cadastrar a turma!');
        console.error(erro);
        setTimeout(() => {
          this.cancelar();
        }, 2000);
      },
    });
  }

  cancelar() {
    this.location.back();
  }
}
