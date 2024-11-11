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
  formNota!: FormGroup;
  idAluno!: number;
  listaTurmas: TurmaInterface[] = [];
  listaDocentes: DocenteInterface[] = [];
  listaAlunos: AlunoInterface[] = [];
  listaMaterias: MateriaInterface[] = [];
  perfilAtivo!: UsuarioInterface;
  docenteByEmail: DocenteInterface | undefined;

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
      let idDocente = this.docenteByEmail?.id;
      this.docenteService
        .getDocenteByEmail(this.perfilAtivo.email)
        .subscribe((retorno) => {
          this.listaDocentes = retorno;
          this.docenteByEmail = retorno.find((item) => {
            return item.email === this.perfilAtivo.email;
          });
          idDocente = this.docenteByEmail?.id;
          if (this.docenteByEmail) {
            this.getTurmasAndMateriasByDocente(this.docenteByEmail);
            this.formNota.patchValue({
              docente: [this.docenteByEmail.nomeCompleto],
            });
          }
          this.formNota.get('docente')?.disable();
        });
    } else {
      this.docenteService.getDocentes().subscribe((retorno) => {
        this.listaDocentes = retorno;
      });
    }
  }

  getTurmasAndMateriasByDocente(idDocente: DocenteInterface) {
    this.formNota.patchValue({
      turma: '',
      materia: '',
      aluno: '',
    });
    this.turmaService.getTurmasByDocente(idDocente.id).subscribe((retorno) => {
      this.listaTurmas = retorno;
    });
    this.materiaService
      .getMateriasByDocente(idDocente.id)
      .subscribe((retorno) => {
        this.listaMaterias = retorno;
      });
  }

  getAlunosByTurma(idTurma: TurmaInterface) {
    this.alunoService.getAlunosByTurma(idTurma.id).subscribe((retorno) => {
      this.listaAlunos = retorno;
    });
  }

  submitForm() {
    let dadosNota;
    if (this.formNota.valid) {
      if (this.docenteByEmail !== undefined) {
        this.formNota.removeControl('turma');
        dadosNota = {
          ...this.formNota.value,
          docente: this.docenteByEmail?.id,
        };
        console.log(dadosNota);
      }
      this.cadastrarNota(dadosNota);
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
