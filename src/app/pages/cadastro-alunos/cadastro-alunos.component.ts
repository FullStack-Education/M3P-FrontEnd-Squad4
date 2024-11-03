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
import { NgxMaskDirective } from 'ngx-mask';
import { AlunoInterface } from '../../core/interfaces/aluno.interface';
import { TurmaInterface } from '../../core/interfaces/turma.interface';
import { AlunoService } from '../../core/services/aluno.service';
import { TurmaService } from '../../core/services/turma.service';
import { CepService } from '../../core/services/cep.service';
import { Genero } from '../../core/enums/genero.enum';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { ErroFormComponent } from '../../shared/components/erro-form/erro-form.component';
import { NotaService } from '../../core/services/nota.service';

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
    NgxMaskDirective,
  ],
  templateUrl: './cadastro-alunos.component.html',
  styleUrl: './cadastro-alunos.component.scss',
})
export class CadastroAlunosComponent {
  formAluno!: FormGroup;
  idAluno!: number;
  listaTurmas: TurmaInterface[] = [];
  listaNotas!: any[];
  generos = Object.keys(Genero).map((key) => ({
    id: Genero[key as keyof typeof Genero],
    nome: Genero[key as keyof typeof Genero],
  }));

  dataRegex = /^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/;
  cpfRegex = /^(\d{3}\.\d{3}\.\d{3}-\d{2})$/;
  telefoneRegex = /^\(\d{2}\) 9\d{4}-\d{4}$/;
  cepRegex = /^\d{5}-\d{3}$/;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alunoService: AlunoService,
    private turmaService: TurmaService,
    private notaService: NotaService,
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
      telefone: new FormControl('', [
        Validators.required,
        Validators.pattern(this.telefoneRegex),
      ]),
      email: new FormControl('', Validators.email),
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
      turma: new FormControl(null, Validators.required),
    });

    this.turmaService
      .getTurmas()
      .subscribe((retorno) => (this.listaTurmas = retorno));

    if (this.idAluno) {
      this.getNotasAluno();
      this.getTurmasAluno();
      this.alunoService.getAluno(this.idAluno).subscribe({
        next: (retorno) => {
          retorno.cpf = this.formatarCPF(retorno.cpf);
          retorno.telefone = this.formatarTelefone(retorno.telefone);
          retorno.cep = this.formatarCep(retorno.cep);
          this.formAluno.patchValue(retorno);
          this.formAluno.disable();
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

  getNotasAluno() {
    this.notaService
      .getNotasByAluno(this.idAluno)
      .subscribe((retorno) => (this.listaNotas = retorno));
  }

  getTurmasAluno() {
    this.turmaService
      .getTurmasByAluno(this.idAluno)
      .subscribe((retorno) => (this.listaTurmas = retorno));
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

  formatarCPF(cpf: string): string {
    return cpf
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{2})$/, '$1-$2');
  }

  formatarTelefone(telefone: string): string {
    return telefone
      .replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
      .replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  }

  formatarCep(cep: string): string {
    return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }

  removerCaracteresEspeciais(valor: string): string {
    return valor.replace(/\D/g, '');
  }

  submitForm() {
    if (this.formAluno.valid) {
      const AlunoData = {
        ...this.formAluno.value,
        email: this.formAluno.get('email')?.value,
        cpf: this.removerCaracteresEspeciais(
          this.formAluno.get('cpf')?.value || ''
        ),
        telefone: this.removerCaracteresEspeciais(
          this.formAluno.get('telefone')?.value || ''
        ),
        cep: this.removerCaracteresEspeciais(
          this.formAluno.get('cep')?.value || ''
        ),
      };

      if (this.idAluno) {
        this.editarAluno(AlunoData);
      } else {
        this.cadastrarAluno(AlunoData);
      }
    } else {
      this.formAluno.markAllAsTouched();
    }
  }

  habilitarEdicao() {
    this.formAluno.enable();
    this.formAluno.get('email')?.disable();
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
    console.log('Notas ---> ' + this.listaNotas.length);
    if (this.listaNotas.length > 0 || this.listaTurmas.length > 0) {
      this.toastr.warning(
        'Aluno não pode ser excluído, pois possui turmas ou notas vinculadas!'
      );
      return;
    }

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
