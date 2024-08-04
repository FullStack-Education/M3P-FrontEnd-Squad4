import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CepService } from '../../core/services/cep.service';
import { MatButtonModule } from '@angular/material/button';
import { DocenteService } from '../../core/services/docente.service';
import { DocenteInterface } from '../../core/interfaces/docente.interface';
import { ToastrService } from 'ngx-toastr';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { MateriaInterface } from '../../core/interfaces/materia.interface';
import { MateriaService } from '../../core/services/materia.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cadastro-docentes',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    NgSelectModule,
    FormsModule,
  ],
  templateUrl: './cadastro-docentes.component.html',
  styleUrl: './cadastro-docentes.component.scss',
})
export class CadastroDocentesComponent implements OnInit {
  formDocente!: FormGroup;
  idDocente: string | undefined;

  materias!: [];
  listaMaterias: MateriaInterface[] = [];

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
      materias: new FormControl('', Validators.required),
    });

    this.materiaService.getMaterias().subscribe((retorno) => {
      retorno.forEach((materia) => {
        this.listaMaterias.push(materia);
      });
    });

    if (this.idDocente) {
      this.docenteService.getDocente(this.idDocente).subscribe((retorno) => {
        if (retorno) {
          this.formDocente.disable();
          this.formDocente.patchValue(retorno);
        }
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
        error: (err) => {
          this.toastr.error('Ocorreu um erro ao buscar o CEP digitado!');
          console.log(err);
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
    this.formDocente.reset();
    this.location.back();
  }
}
