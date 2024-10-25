import { Component, OnInit } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective } from 'ngx-mask';
import { DocenteInterface } from '../../core/interfaces/docente.interface';
import { MateriaInterface } from '../../core/interfaces/materia.interface';
import { DocenteService } from '../../core/services/docente.service';
import { TurmaService } from '../../core/services/turma.service';
import { MateriaService } from '../../core/services/materia.service';
import { NotaService } from '../../core/services/nota.service';
import { CepService } from '../../core/services/cep.service';
import { Genero } from '../../core/enums/genero.enum';
import { EstadoCivil } from '../../core/enums/estado-civil.enum';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { ErroFormComponent } from '../../shared/components/erro-form/erro-form.component';

@Component({
  selector: 'app-cadastro-docentes',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    NgSelectModule,
    CommonModule,
    ErroFormComponent,
    NgxMaskDirective,
  ],
  templateUrl: './cadastro-docentes.component.html',
  styleUrl: './cadastro-docentes.component.scss',
})
export class CadastroDocentesComponent implements OnInit {
  formDocente!: FormGroup;
  idDocente!: string;
  listaMaterias!: MateriaInterface[];
  listaNotasProfessor!: any[];
  listaTurmasProfessor!: any[];
  generos = Object.keys(Genero).map((key) => ({
    id: Genero[key as keyof typeof Genero],
    nome: Genero[key as keyof typeof Genero],
  }));
  estadoCivil = Object.keys(EstadoCivil).map((key) => ({
    id: EstadoCivil[key as keyof typeof EstadoCivil],
    nome: EstadoCivil[key as keyof typeof EstadoCivil],
  }));

  dataRegex = /^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/;
  cpfRegex = /^(\d{3}\.\d{3}\.\d{3}-\d{2})$/;
  telefoneRegex = /^\(\d{2}\) 9\d{4}-\d{4}$/;
  cepRegex = /^\d{5}-\d{3}$/;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private docenteService: DocenteService,
    private materiaService: MateriaService,
    private notaService: NotaService,
    private turmaService: TurmaService,
    private cepService: CepService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.idDocente = this.activatedRoute.snapshot.params['id'];

    this.formDocente = new FormGroup({
      nomeCompleto: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
      ]),
      nascimento: new FormControl('', [
        Validators.required,
        Validators.pattern(this.dataRegex),
      ]),
      naturalidade: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
      ]),
      genero: new FormControl(null, Validators.required),
      cpf: new FormControl('', [
        Validators.required,
        Validators.pattern(this.cpfRegex),
      ]),
      rg: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      estadoCivil: new FormControl(null, Validators.required),
      telefone: new FormControl('', [
        Validators.required,
        Validators.pattern(this.telefoneRegex),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      cep: new FormControl('', Validators.pattern(this.cepRegex)),
      localidade: new FormControl(''),
      uf: new FormControl(''),
      logradouro: new FormControl(''),
      numero: new FormControl(''),
      complemento: new FormControl(''),
      bairro: new FormControl(''),
      referencia: new FormControl(''),
      materias: new FormControl('', Validators.required),
    });

    this.materiaService
      .getMaterias()
      .subscribe((retorno) => (this.listaMaterias = retorno));

    if (this.idDocente) {
      this.getNotasProfessor();
      this.getTurmasProfessor();
      this.docenteService.getDocente(this.idDocente).subscribe({
        next: (retorno) => {
          this.formDocente.disable();
          this.formDocente.patchValue(retorno);
        },
        error: (erro) => {
          this.toastr.error('Docente não encontrado!');
          console.log(erro);
          setTimeout(() => {
            this.cancelar();
          }, 2000);
        },
      });
    }
  }

  getNotasProfessor() {
    this.notaService
      .getNotasByProfessor(this.idDocente)
      .subscribe((retorno) => (this.listaNotasProfessor = retorno));
  }

  getTurmasProfessor() {
    this.turmaService
      .getTurmasByProfessor(this.idDocente)
      .subscribe((retorno) => (this.listaTurmasProfessor = retorno));
  }

  buscarCep() {
    if (this.formDocente.value.cep) {
      this.cepService.buscarCep(this.formDocente.value.cep).subscribe({
        next: (retorno) => {
          if ((retorno as any).erro) {
            this.toastr.error('CEP digitado inválido!');
          } else {
            this.formDocente.patchValue(retorno);
          }
        },
        error: (erro) => {
          this.toastr.error('Ocorreu um erro ao buscar o CEP digitado!');
          console.log(erro);
        },
      });
    }
  }

  submitForm() {
    if (this.formDocente.valid) {
      if (this.idDocente) {
        this.editarDocente(this.formDocente.value);
      } else {
        this.cadastrarDocente(this.formDocente.value);
      }
    } else {
      this.formDocente.markAllAsTouched();
    }
  }

  habilitarEdicao() {
    this.formDocente.enable();
  }

  cadastrarDocente(docente: DocenteInterface) {
    this.docenteService.postDocente(docente).subscribe(() => {
      this.toastr.success('Docente cadastrado com sucesso!');
      this.router.navigate(['/home']);
    });
  }

  editarDocente(docente: DocenteInterface) {
    docente.id = this.idDocente!;
    this.docenteService.putDocente(docente).subscribe(() => {
      this.toastr.success('Docente alterado com sucesso!');
      this.router.navigate(['/home']);
    });
  }

  excluirDocente(docente: DocenteInterface) {
    if (
      this.listaNotasProfessor.length > 0 ||
      this.listaTurmasProfessor.length > 0
    ) {
      this.toastr.warning(
        'Docente não pode ser excluído, pois possui turmas ou notas vinculadas!'
      );
      return;
    }

    docente.id = this.idDocente!;

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        titulo: 'Excluir Docente',
        mensagem: 'Você tem certeza que deseja prosseguir com a exclusão?',
        btConfirmar: 'Confirmar',
        btCancelar: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((retorno) => {
      if (retorno) {
        this.docenteService.deleteDocente(docente).subscribe(() => {
          this.toastr.success('Docente excluído com sucesso!');
          this.router.navigate(['/home']);
        });
      } else {
        return;
      }
    });
  }

  cancelar() {
    this.location.back();
  }
}
