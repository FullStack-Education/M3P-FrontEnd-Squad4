import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AlunoService } from '../../core/services/aluno.service';
import { TurmaService } from '../../core/services/turma.service';
import { NotaService } from '../../core/services/nota.service';
import { UsuariosService } from '../../core/services/usuarios.service';
import { LoginService } from '../../core/services/login.service';
import { AlunoInterface } from '../../core/interfaces/aluno.interface';
import { UsuarioInterface } from '../../core/interfaces/usuario.interface';
import { TurmaInterface } from '../../core/interfaces/turma.interface';
import { NotaInterface } from '../../core/interfaces/nota.interface';
import { CommonModule } from '@angular/common';
import { DocenteInterface } from '../../core/interfaces/docente.interface';
import { DocenteService } from '../../core/services/docente.service';

@Component({
  selector: 'app-listagem-notas',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  templateUrl: './listagem-notas.component.html',
  styleUrl: './listagem-notas.component.scss',
})
export class ListagemNotasComponent implements OnInit {
  usuarioLogado: UsuarioInterface | null = null;
  alunoAtivo: AlunoInterface = {
    id: '',
    nomeCompleto: '',
    genero: '',
    nascimento: new Date(),
    cpf: '',
    rg: '',
    estadoCivil: '',
    telefone: 0,
    email: '',
    senha: '',
    naturalidade: '',
    cep: 0,
    localidade: '',
    uf: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    referencia: '',
    turmas: [],
  };
  listaAlunos: AlunoInterface[] = [];
  listaTurmas: TurmaInterface[] = [];
  listaNotas: NotaInterface[] = [];
  listaDocentes: DocenteInterface[] = [];

  constructor(
    private loginService: LoginService,
    private alunoService: AlunoService,
    private turmaService: TurmaService,
    private notaService: NotaService,
    private docenteService: DocenteService
  ) {}

  ngOnInit(): void {
    this.usuarioLogado = this.loginService.usuarioLogado;
    this.alunoService
      .getAlunoByEmail(this.usuarioLogado.email)
      .subscribe((retorno) => {
        if (retorno.length > 0) this.alunoAtivo = retorno[0];

        if (this.alunoAtivo) {
          this.getNotasAluno();
          this.getTurmasAluno();
        }
      });
  }

  getTurmasAluno() {
    this.turmaService.getTurmas().subscribe((retorno) => {
      this.listaTurmas = retorno.filter((item) => {
        return this.alunoAtivo.turmas.includes(item.id);
      });
      let idProfessor = this.listaTurmas.map((item) => item.id);
      this.getProfessores(idProfessor);
    });
  }

  getProfessores(idProfessores: Array<string>) {
    this.docenteService.getDocentes().subscribe(
      (retorno) =>
        (this.listaDocentes = retorno.filter((item) => {
          return idProfessores.includes(item.id);
        }))
    );
  }

  getNomeProfessorTurma(idProfessor: string) {
    let professor = this.listaDocentes.filter((item) => {
      return item.id == idProfessor;
    });
    if (professor.length == 0) {
      return 'Professor não encontrado!';
    }
    return professor[0].nomeCompleto;
  }

  getNotasAluno() {
    this.notaService
      .getNotasByAluno(this.alunoAtivo.id)
      .subscribe((retorno) => {
        this.listaNotas = retorno;
      });
  }
}
