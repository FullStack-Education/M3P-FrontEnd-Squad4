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
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AlunoInterface } from '../../core/interfaces/aluno.interface';
import { TurmaInterface } from '../../core/interfaces/turma.interface';
import { AlunoService } from '../../core/services/aluno.service';
import { TurmaService } from '../../core/services/turma.service';
import { CepService } from '../../core/services/cep.service';
import { Genero } from '../../core/enums/genero.enum';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { ErroFormComponent } from '../../shared/components/erro-form/erro-form.component';

@Component({
  selector: 'app-cadastro-alunos',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    NgSelectModule,
    CommonModule,
    ErroFormComponent,
  ],
  templateUrl: './cadastro-alunos.component.html',
  styleUrl: './cadastro-alunos.component.scss',
})
export class CadastroAlunosComponent {
  formAluno!: FormGroup;
  idAluno: string | undefined;
  listaTurmas: TurmaInterface[] = [];
  generos = Object.keys(Genero).map((key) => ({
    id: Genero[key as keyof typeof Genero],
    nome: Genero[key as keyof typeof Genero],
  }));

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alunoService: AlunoService,
    private turmaService: TurmaService,
    private cepService: CepService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.idAluno = this.activatedRoute.snapshot.params['id'];

    this.formAluno = new FormGroup({
      nomeCompleto: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
      ]),
      nascimento: new FormControl('', Validators.required),
      naturalidade: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
      ]),
      genero: new FormControl(null, Validators.required),
      cpf: new FormControl('', Validators.required),
      rg: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      telefone: new FormControl('', Validators.required),
      email: new FormControl('', Validators.email),
      senha: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      cep: new FormControl(''),
      localidade: new FormControl(''),
      uf: new FormControl(''),
      logradouro: new FormControl(''),
      numero: new FormControl(''),
      complemento: new FormControl(''),
      bairro: new FormControl(''),
      referencia: new FormControl(''),
      turmas: new FormControl(null, Validators.required),
    });

    this.turmaService
      .getTurmas()
      .subscribe((retorno) => (this.listaTurmas = retorno));

    if (this.idAluno) {
      this.alunoService.getAluno(this.idAluno).subscribe({
        next: (retorno) => {
          this.formAluno.disable();
          this.formAluno.patchValue(retorno);
        },
        error: (erro) => {
          this.toastr.error('Aluno não encontrado!');
          console.log(erro);
          setTimeout(() => {
            this.cancelar();
          }, 2000);
        },
      });
    }
  }

  buscarCep() {
    if (this.formAluno.value.cep) {
      this.cepService.buscarCep(this.formAluno.value.cep).subscribe({
        next: (retorno) => {
          if ((retorno as any).erro) {
            this.toastr.error('CEP digitado inválido!');
          } else {
            this.formAluno.patchValue(retorno);
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
    if (this.formAluno.valid) {
      if (this.idAluno) {
        this.editarAluno(this.formAluno.value);
      } else {
        this.cadastrarAluno(this.formAluno.value);
      }
    } else {
      this.formAluno.markAllAsTouched();
    }
  }

  habilitarEdicao() {
    this.formAluno.enable();
  }

  cadastrarAluno(aluno: AlunoInterface) {
    this.alunoService.postAluno(aluno).subscribe(() => {
      this.toastr.success('Aluno cadastrado com sucesso!');
      this.router.navigate(['/home']);
    });
  }

  editarAluno(aluno: AlunoInterface) {
    aluno.id = this.idAluno!;
    this.alunoService.putAluno(aluno).subscribe(() => {
      this.toastr.success('Aluno alterado com sucesso!');
      this.router.navigate(['/home']);
    });
  }

  excluirAluno(aluno: AlunoInterface) {
    aluno.id = this.idAluno!;

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        titulo: 'Excluir Aluno',
        mensagem: 'Você tem certeza que deseja prosseguir com a exclusão?',
        btConfirmar: 'Confirmar',
        btCancelar: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((retorno) => {
      if (retorno) {
        this.alunoService.deleteAluno(aluno).subscribe(() => {
          this.toastr.success('Aluno excluído com sucesso!');
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
