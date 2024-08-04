import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CepService } from '../../core/services/cep.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AlunoService } from '../../core/services/aluno.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { AlunoInterface } from '../../core/interfaces/aluno.interface';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { Location } from '@angular/common';
import { TurmaInterface } from '../../core/interfaces/turma.interface';
import { TurmaService } from '../../core/services/turma.service';

@Component({
  selector: 'app-cadastro-alunos',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    NgSelectModule,
    FormsModule,
  ],
  templateUrl: './cadastro-alunos.component.html',
  styleUrl: './cadastro-alunos.component.scss',
})
export class CadastroAlunosComponent {
  formAluno!: FormGroup;
  idAluno: string | undefined;

  turmas!: [];
  listaTurmas: TurmaInterface[] = [];

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
      genero: new FormControl('', Validators.required),
      cpf: new FormControl('', Validators.required),
      rg: new FormControl('', Validators.required),
      estadoCivil: new FormControl('', Validators.required),
      telefone: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      cep: new FormControl('', Validators.required),
      localidade: new FormControl(''),
      uf: new FormControl(''),
      logradouro: new FormControl(''),
      numero: new FormControl(''),
      complemento: new FormControl(''),
      bairro: new FormControl(''),
      referencia: new FormControl(''),
      turmas: new FormControl('', Validators.required),
    });

    this.turmaService.getTurmas().subscribe((retorno) => {
      retorno.forEach((turma) => {
        this.listaTurmas.push(turma);
      });
    });

    if (this.idAluno) {
      this.alunoService.getAluno(this.idAluno).subscribe((retorno) => {
        if (retorno) {
          this.formAluno.disable();
          this.formAluno.patchValue(retorno);
        }
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
        error: (err) => {
          this.toastr.error('Ocorreu um erro ao buscar o CEP digitado!');
          console.log(err);
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
    this.formAluno.reset();
    this.location.back();
  }
}
