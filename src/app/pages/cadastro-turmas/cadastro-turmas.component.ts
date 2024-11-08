import { Component } from '@angular/core';
import { Location } from '@angular/common';
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
import { MatIconModule } from '@angular/material/icon';
import { UsuarioInterface } from '../../core/interfaces/usuario.interface';
import { DocenteInterface } from '../../core/interfaces/docente.interface';
import { TurmaInterface } from '../../core/interfaces/turma.interface';
import { LoginService } from '../../core/services/login.service';
import { DocenteService } from '../../core/services/docente.service';
import { TurmaService } from '../../core/services/turma.service';
import { ErroFormComponent } from '../../shared/components/erro-form/erro-form.component';

@Component({
  selector: 'app-cadastro-turmas',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    NgSelectModule,
    MatIconModule,
    ErroFormComponent,
  ],
  templateUrl: './cadastro-turmas.component.html',
  styleUrl: './cadastro-turmas.component.scss',
})
export class CadastroTurmasComponent {
  formTurma!: FormGroup;
  idTurma: string | undefined;
  listaProfessores: DocenteInterface[] = [];
  perfilAtivo!: UsuarioInterface;

  dataRegex = /^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private activatedRoute: ActivatedRoute,
    private turmaService: TurmaService,
    private docenteService: DocenteService,
    private toastr: ToastrService,
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
      dataInicio: new FormControl('', [
        Validators.required,
        Validators.pattern(this.dataRegex),
      ]),
      dataTermino: new FormControl('', [
        Validators.required,
        Validators.pattern(this.dataRegex),
      ]),
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
      this.cadastrarTurma(this.formTurma.value);
    } else {
      this.formTurma.markAllAsTouched();
    }
  }

  cadastrarTurma(turma: TurmaInterface) {
    this.turmaService.postTurma(turma).subscribe(() => {
      this.toastr.success('Turma cadastrada com sucesso!');
      this.router.navigate(['/home']);
    });
  }

  cancelar() {
    this.location.back();
  }
}
