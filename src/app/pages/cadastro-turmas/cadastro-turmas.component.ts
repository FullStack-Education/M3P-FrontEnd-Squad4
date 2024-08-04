import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { DocenteInterface } from '../../core/interfaces/docente.interface';
import { DocenteService } from '../../core/services/docente.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { TurmaService } from '../../core/services/turma.service';
import { TurmaInterface } from '../../core/interfaces/turma.interface';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
import { LoginService } from '../../core/services/login.service';
import { UsuarioInterface } from '../../core/interfaces/usuario.interface';

@Component({
  selector: 'app-cadastro-turmas',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    NgSelectModule,
    MatIconModule,
  ],
  templateUrl: './cadastro-turmas.component.html',
  styleUrl: './cadastro-turmas.component.scss',
})
export class CadastroTurmasComponent {
  formTurma!: FormGroup;
  idTurma: string | undefined;
  listaProfessores: DocenteInterface[] = [];
  perfilAtivo!: UsuarioInterface;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private activatedRoute: ActivatedRoute,
    private turmaService: TurmaService,
    private docenteService: DocenteService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.perfilAtivo = this.loginService.usuarioLogado;
    this.idTurma = this.activatedRoute.snapshot.params['id'];

    this.formTurma = new FormGroup({
      nomeTurma: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
      ]),
      dataInicio: new FormControl('', Validators.required),
      dataTermino: new FormControl('', Validators.required),
      horario: new FormControl('', Validators.required),
      professor: new FormControl('', Validators.required),
    });

    const now = new Date();
    const dataFormatada = now.toISOString().split('T')[0];
    const horaFormatada = now.toTimeString().split(' ')[0].slice(0, 5);
    this.formTurma.get('dataInicio')?.setValue(dataFormatada);
    this.formTurma.get('dataTermino')?.setValue(dataFormatada);
    this.formTurma.get('horario')?.setValue(horaFormatada);

    if (this.perfilAtivo.perfil === 'docente') {
      this.docenteService
        .getDocenteByEmail(this.perfilAtivo.email)
        .subscribe((retorno) => {
          this.listaProfessores = retorno;
          this.formTurma.patchValue({
            professor: retorno[0].id,
          });
        });
    } else {
      this.docenteService.getDocentes().subscribe((retorno) => {
        this.listaProfessores = retorno;
      });
    }

    if (this.idTurma) {
      this.turmaService.getTurma(this.idTurma).subscribe((retorno) => {
        if (retorno) {
          this.formTurma.disable();
          this.formTurma.patchValue(retorno);
        }
      });
    }
  }

  submitForm() {
    if (this.formTurma.valid) {
      if (this.idTurma) {
        this.editarTurma(this.formTurma.value);
      } else {
        this.cadastrarTurma(this.formTurma.value);
      }
    } else {
      this.formTurma.markAllAsTouched();
    }
  }

  habilitarEdicao() {
    this.formTurma.enable();
  }

  cadastrarTurma(turma: TurmaInterface) {
    this.turmaService.postTurma(turma).subscribe(() => {
      this.toastr.success('Turma cadastrada com sucesso!');
      this.router.navigate(['/home']);
    });
  }

  editarTurma(turma: TurmaInterface) {
    turma.id = this.idTurma!;
    this.turmaService.putTurma(turma).subscribe(() => {
      this.toastr.success('Turma alterada com sucesso!');
      this.router.navigate(['/home']);
    });
  }

  excluirTurma(turma: TurmaInterface) {
    turma.id = this.idTurma!;

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        titulo: 'Excluir Turma',
        mensagem: 'Você tem certeza que deseja prosseguir com a exclusão?',
        btConfirmar: 'Confirmar',
        btCancelar: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((retorno) => {
      if (retorno) {
        this.turmaService.deleteTurma(turma).subscribe(() => {
          this.toastr.success('Turma excluído com sucesso!');
          this.router.navigate(['/home']);
        });
      } else {
        return;
      }
    });
  }

  cancelar() {
    this.formTurma.reset();
    this.location.back();
  }
}
