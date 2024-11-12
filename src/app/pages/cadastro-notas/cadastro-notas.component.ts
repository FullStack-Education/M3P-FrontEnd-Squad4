import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { UsuarioInterface } from '../../core/interfaces/usuario.interface';
import { DocenteInterface } from '../../core/interfaces/docente.interface';
import { AlunoInterface } from '../../core/interfaces/aluno.interface';
import { MateriaInterface } from '../../core/interfaces/materia.interface';
import { NotaInterface } from '../../core/interfaces/nota.interface';
import { LoginService } from '../../core/services/login.service';
import { DocenteService } from '../../core/services/docente.service';
import { AlunoService } from '../../core/services/aluno.service';
import { NotaService } from '../../core/services/nota.service';
import { ErroFormComponent } from '../../shared/components/erro-form/erro-form.component';
import { TurmaInterface } from '../../core/interfaces/turma.interface';
import { TurmaService } from '../../core/services/turma.service';
import { MateriaService } from '../../core/services/materia.service';

@Component({
  selector: 'app-cadastro-notas',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    NgSelectModule,
    MatIconModule,
    ErroFormComponent,
    CommonModule,
  ],
  templateUrl: './cadastro-notas.component.html',
  styleUrl: './cadastro-notas.component.scss',
})
export class CadastroNotasComponent implements OnInit {
  perfilAtivo!: UsuarioInterface;
  formNota!: FormGroup;
  idAluno!: number;
  listaTurmas: TurmaInterface[] = [];
  listaDocentes: DocenteInterface[] = [];
  listaAlunos: AlunoInterface[] = [];
  listaMaterias: MateriaInterface[] = [];

  dataRegex = /^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private activatedRoute: ActivatedRoute,
    private notaService: NotaService,
    private turmaService: TurmaService,
    private docenteService: DocenteService,
    private materiaService: MateriaService,
    private alunoService: AlunoService,
    private toastr: ToastrService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loginService.usuarioLogado$.subscribe((usuarioLogado) => {
      if (usuarioLogado) {
        this.perfilAtivo = usuarioLogado;
        this.inicializaForm();
      }
    });

    this.idAluno = this.activatedRoute.snapshot.params['id'];
  }

  inicializaForm() {
    this.formNota = new FormGroup({
      turma: new FormControl('', Validators.required),
      docente: new FormControl('', Validators.required),
      materia: new FormControl('', Validators.required),
      avaliacao: new FormControl('', Validators.required),
      data: new FormControl('', [
        Validators.required,
        Validators.pattern(this.dataRegex),
      ]),
      aluno: new FormControl('', Validators.required),
      nota: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(10),
      ]),
    });

    const now = new Date();
    const dataFormatada = now.toISOString().split('T')[0];
    this.formNota.get('data')?.setValue(dataFormatada);

    this.carregarDocentes();
  }

  carregarDocentes() {
    if (this.perfilAtivo.papel == 'PROFESSOR') {
      this.docenteService.getDocentes().subscribe({
        next: (retorno) => {
          this.listaDocentes = retorno.filter((item) => {
            return item.email === this.perfilAtivo.email;
          });
        },
        error: (erro) => {
          this.toastr.error('Ocorreu um erro ao buscar lista de docentes!');
          console.log(erro);
        },
      });
    } else {
      this.docenteService.getDocentes().subscribe({
        next: (retorno) => {
          this.listaDocentes = retorno;
        },
        error: (erro) => {
          this.toastr.error('Ocorreu um erro ao buscar lista de docentes!');
          console.log(erro);
        },
      });
    }
  }

  getTurmasAndMateriasByDocente(idDocente: DocenteInterface) {
    this.formNota.patchValue({
      turma: '',
      materia: '',
    });

    this.listaTurmas = [];
    this.listaMaterias = [];

    this.turmaService.getTurmasByDocente(idDocente.id).subscribe({
      next: (retorno) => {
        this.listaTurmas = retorno;
      },
      error: (erro) => {
        this.toastr.error('Não há turmas cadastradas!');
        console.log(erro);
      },
    });

    this.materiaService.getMateriasByDocente(idDocente.id).subscribe({
      next: (retorno) => {
        this.listaMaterias = retorno;
      },
      error: (erro) => {
        this.toastr.error('Não há matérias cadastradas!');
        console.log(erro);
      },
    });
  }

  getAlunosByTurma(idTurma: TurmaInterface) {
    this.formNota.patchValue({
      aluno: '',
    });

    this.listaAlunos = [];

    this.alunoService.getAlunosByTurma(idTurma.id).subscribe({
      next: (retorno) => {
        this.listaAlunos = retorno;
      },
      error: (erro) => {
        this.toastr.error('Não há alunos cadastrados nesta turma!');
        console.log(erro);
      },
    });
  }

  submitForm() {
    if (this.formNota.valid) {
      this.formNota.removeControl('turma');
      this.cadastrarNota(this.formNota.value);
    } else {
      this.formNota.markAllAsTouched();
    }
  }

  cadastrarNota(nota: NotaInterface) {
    this.notaService.postNota(nota).subscribe({
      next: () => {
        this.toastr.success('Avaliação cadastrada com sucesso!');
        this.router.navigate(['/home']);
      },
      error: (erro) => {
        this.toastr.error('Ocorreu um erro ao cadastrar a avaliação!');
        console.log(erro);
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
