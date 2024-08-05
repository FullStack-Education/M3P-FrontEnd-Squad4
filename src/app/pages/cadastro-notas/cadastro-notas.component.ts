import { Component } from '@angular/core';
import { Location } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
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

@Component({
  selector: 'app-cadastro-notas',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    NgSelectModule,
    MatIconModule,
  ],
  templateUrl: './cadastro-notas.component.html',
  styleUrl: './cadastro-notas.component.scss',
})
export class CadastroNotasComponent {
  formNota!: FormGroup;
  idAluno!: string;
  listaProfessores: DocenteInterface[] = [];
  listaAlunos: AlunoInterface[] = [];
  listaMaterias: MateriaInterface[] = [];
  perfilAtivo!: UsuarioInterface;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private activatedRoute: ActivatedRoute,
    private notaService: NotaService,
    private docenteService: DocenteService,
    private alunoService: AlunoService,
    private materiaService: MateriaService,
    private toastr: ToastrService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.perfilAtivo = this.loginService.usuarioLogado;
    this.idAluno = this.activatedRoute.snapshot.params['id'];

    this.formNota = new FormGroup({
      professor: new FormControl('', Validators.required),
      materia: new FormControl('', Validators.required),
      avaliacao: new FormControl('', Validators.required),
      data: new FormControl('', Validators.required),
      aluno: new FormControl('', Validators.required),
      nota: new FormControl('', Validators.required),
    });

    const now = new Date();
    const dataFormatada = now.toISOString().split('T')[0];
    this.formNota.get('data')?.setValue(dataFormatada);

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

    if (this.perfilAtivo.perfil === 'docente') {
      this.docenteService
        .getDocenteByEmail(this.perfilAtivo.email)
        .subscribe((retorno) => {
          this.listaProfessores = retorno;
          this.formNota.patchValue({
            professor: retorno[0].id,
          });
        });
    } else {
      this.docenteService.getDocentes().subscribe((retorno) => {
        this.listaProfessores = retorno;
      });
    }

    this.materiaService.getMaterias().subscribe((retorno) => {
      this.listaMaterias = retorno;
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
