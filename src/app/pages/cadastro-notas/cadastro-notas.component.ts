import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
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
import { MateriaService } from '../../core/services/materia.service';
import { NotaService } from '../../core/services/nota.service';
import { ErroFormComponent } from '../../shared/components/erro-form/erro-form.component';
import { TurmaInterface } from '../../core/interfaces/turma.interface';
import { TurmaService } from '../../core/services/turma.service';

@Component({
  selector: 'app-cadastro-notas',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    NgSelectModule,
    MatIconModule,
    ErroFormComponent,
  ],
  templateUrl: './cadastro-notas.component.html',
  styleUrl: './cadastro-notas.component.scss',
})
export class CadastroNotasComponent implements OnInit {
  formNota!: FormGroup;
  idAluno!: number;
  listaTurmasProfessor: TurmaInterface[] = [];
  listaProfessores: DocenteInterface[] = [];
  listaAlunos: AlunoInterface[] = [];
  listaMaterias: MateriaInterface[] = [];
  perfilAtivo!: UsuarioInterface;

  dataRegex = /^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private activatedRoute: ActivatedRoute,
    private notaService: NotaService,
    private turmaService: TurmaService,
    private docenteService: DocenteService,
    private alunoService: AlunoService,
    private materiaService: MateriaService,
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
      professor: new FormControl('', Validators.required),
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

    this.carregarAlunos();
    this.carregarProfessores();
  }

  carregarAlunos() {
    if (this.idAluno) {
      this.alunoService.getAluno(this.idAluno).subscribe((retorno) => {
        this.listaAlunos = [retorno];
        this.formNota.patchValue({
          aluno: retorno.id,
        });
      });
    } else {
      this.alunoService.getAlunos().subscribe((retorno) => {
        this.listaAlunos = retorno;
      });
    }
  }

  carregarProfessores() {
    if (this.perfilAtivo.papel === 'ADM') {
      this.docenteService
        .getDocenteByEmail(this.perfilAtivo.email)
        .subscribe((retorno) => {
          this.listaProfessores = retorno;
          this.formNota.patchValue({
            professor: retorno[0].id,
          });
          this.getTurmasProfessor(retorno[0]);
        });
    } else {
      this.docenteService.getDocentes().subscribe((retorno) => {
        this.listaProfessores = retorno;
      });
    }
  }

  getTurmasProfessor(idProfessor: DocenteInterface) {
    this.formNota.patchValue({
      turma: '',
      materia: '',
      aluno: '',
    });
    this.turmaService
      .getTurmasByProfessor(idProfessor.id)
      .subscribe((retorno) => {
        this.listaTurmasProfessor = retorno;
        console.log(retorno);
      });

    this.materiaService.getMaterias().subscribe((retorno) => {
      this.listaMaterias = retorno.filter((item) => {
        return idProfessor.materias.includes(item.id);
      });
    });
  }

  getTurmaAlunos(turma: TurmaInterface) {
    this.formNota.patchValue({
      aluno: '',
    });

    this.alunoService.getAlunos().subscribe((retorno) => {
      this.listaAlunos = retorno.filter((item) => {
        return item.turma === turma.id;
      });
    });
  }

  submitForm() {
    if (this.formNota.valid) {
      this.cadastrarNota(this.formNota.value);
    } else {
      this.formNota.markAllAsTouched();
    }
  }

  cadastrarNota(nota: NotaInterface) {
    this.notaService.postNota(nota).subscribe(() => {
      this.toastr.success('Nota cadastrada com sucesso!');
      this.router.navigate(['/home']);
    });
  }

  cancelar() {
    this.location.back();
  }
}
