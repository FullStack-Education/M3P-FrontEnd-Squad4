import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { NotaService } from '../../core/services/nota.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { NotaInterface } from '../../core/interfaces/nota.interface';
import { AlunoInterface } from '../../core/interfaces/aluno.interface';
import { DocenteInterface } from '../../core/interfaces/docente.interface';
import { AlunoService } from '../../core/services/aluno.service';
import { DocenteService } from '../../core/services/docente.service';
import { MateriaInterface } from '../../core/interfaces/materia.interface';
import { MateriaService } from '../../core/services/materia.service';

@Component({
  selector: 'app-cadastro-notas',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    NgSelectModule,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './cadastro-notas.component.html',
  styleUrl: './cadastro-notas.component.scss',
})
export class CadastroNotasComponent {
  formNota!: FormGroup;
  idNota: string | undefined;
  listaProfessores: DocenteInterface[] = [];
  professor!: number;
  listaAlunos: AlunoInterface[] = [];
  aluno!: number;
  listaMaterias: MateriaInterface[] = [];
  materia!: number;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notaService: NotaService,
    private docenteService: DocenteService,
    private alunoService: AlunoService,
    private materiaService: MateriaService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.idNota = this.activatedRoute.snapshot.params['id'];

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

    this.docenteService.getDocentes().subscribe((retorno) => {
      retorno.forEach((docente) => {
        this.listaProfessores.push(docente);
      });
    });

    this.alunoService.getAlunos().subscribe((retorno) => {
      retorno.forEach((aluno) => {
        this.listaAlunos.push(aluno);
      });
    });

    this.materiaService.getMaterias().subscribe((retorno) => {
      retorno.forEach((materia) => {
        this.listaMaterias.push(materia);
      });
    });

    if (this.idNota) {
      this.notaService.getNota(this.idNota).subscribe((retorno) => {
        if (retorno) {
          this.formNota.disable();
          this.formNota.patchValue(retorno);
        }
      });
    }
  }

  submitForm() {
    if (this.formNota.valid) {
      if (this.idNota) {
        this.editarNota(this.formNota.value);
      } else {
        this.cadastrarNota(this.formNota.value);
      }
    } else {
      this.formNota.markAllAsTouched();
    }
  }

  habilitarEdicao() {
    this.formNota.enable();
  }

  cadastrarNota(nota: NotaInterface) {
    this.notaService.postNota(nota).subscribe(() => {
      this.toastr.success('Nota cadastrada com sucesso!');
      this.router.navigate(['/home']);
    });
  }

  editarNota(nota: NotaInterface) {
    nota.id = this.idNota!;
    this.notaService.putNota(nota).subscribe(() => {
      this.toastr.success('Nota alterada com sucesso!');
      this.router.navigate(['/home']);
    });
  }

  excluirNota(nota: NotaInterface) {
    nota.id = this.idNota!;

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        titulo: 'Excluir Nota',
        mensagem: 'Você tem certeza que deseja prosseguir com a exclusão?',
        btConfirmar: 'Confirmar',
        btCancelar: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((retorno) => {
      if (retorno) {
        this.notaService.deleteNota(nota).subscribe(() => {
          this.toastr.success('Nota excluído com sucesso!');
          this.router.navigate(['/home']);
        });
      } else {
        return;
      }
    });
  }

  cancelar() {
    this.formNota.reset();
    this.router.navigate(['/home']);
  }
}
