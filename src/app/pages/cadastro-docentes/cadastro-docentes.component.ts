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
import { MateriaService } from '../../core/services/materia.service';
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
  idDocente!: number;
  listaMaterias!: MateriaInterface[];
  listaNotas: any[] = [];
  listaTurmas: any[] = [];
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

    this.materiaService.getMaterias().subscribe({
      next: (retorno) => {
        this.listaMaterias = retorno;
      },
      error: (erro) => {
        this.toastr.error('Ocorreu um erro ao carregar a lista de matérias!');
        console.error(erro);
      },
    });

    if (this.idDocente) {
      this.docenteService.getDocente(this.idDocente).subscribe({
        next: (retorno) => {
          retorno.cpf = this.formatarCPF(retorno.cpf);
          retorno.telefone = this.formatarTelefone(retorno.telefone);
          retorno.cep = this.formatarCep(retorno.cep);
          this.formDocente.patchValue(retorno);
          this.formDocente.disable();
        },
        error: (erro) => {
          this.toastr.error('Docente não encontrado!');
          console.error(erro);
          setTimeout(() => {
            this.cancelar();
          }, 2000);
        },
      });
    }
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
          console.error(erro);
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
    if (this.formDocente.valid) {
      const docenteData = {
        ...this.formDocente.value,
        email: this.formDocente.get('email')?.value,
        cpf: this.removerCaracteresEspeciais(
          this.formDocente.get('cpf')?.value || ''
        ),
        telefone: this.removerCaracteresEspeciais(
          this.formDocente.get('telefone')?.value || ''
        ),
        cep: this.removerCaracteresEspeciais(
          this.formDocente.get('cep')?.value || ''
        ),
      };

      if (this.idDocente) {
        this.editarDocente(docenteData);
      } else {
        this.cadastrarDocente(docenteData);
      }
    } else {
      this.formDocente.markAllAsTouched();
    }
  }

  habilitarEdicao() {
    this.formDocente.enable();
    this.formDocente.get('email')?.disable();
  }

  cadastrarDocente(docente: DocenteInterface) {
    this.docenteService.postDocente(docente).subscribe({
      next: () => {
        this.toastr.success('Docente cadastrado com sucesso!');
        this.router.navigate(['/home']);
      },
      error: (erro) => {
        this.toastr.error('Ocorreu um erro ao cadastrar o docente!');
        console.error(erro);
      },
    });
  }

  editarDocente(docente: DocenteInterface) {
    docente.id = this.idDocente!;
    this.docenteService.putDocente(docente).subscribe({
      next: () => {
        this.toastr.success('Docente alterado com sucesso!');
        this.router.navigate(['/home']);
      },
      error: (erro) => {
        this.toastr.error('Ocorreu um erro ao editar o docente!');
        console.error(erro);
      },
    });
  }

  excluirDocente(docente: DocenteInterface) {
    if (this.listaNotas.length > 0 || this.listaTurmas.length > 0) {
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

    dialogRef.afterClosed().subscribe({
      next: (retorno) => {
        if (retorno) {
          this.docenteService.deleteDocente(docente).subscribe({
            next: () => {
              this.toastr.success('Docente excluído com sucesso!');
              this.router.navigate(['/home']);
            },
            error: (erro) => {
              this.toastr.error('Ocorreu um erro ao excluir o docente!');
              console.error(erro);
            },
          });
        } else {
          return;
        }
      },
      error: (erro) => {
        this.toastr.error('Ocorreu um erro!');
        console.error(erro);
      },
    });
  }

  cancelar() {
    this.location.back();
  }
}
