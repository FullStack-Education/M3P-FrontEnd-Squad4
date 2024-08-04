import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { LoginService } from '../../core/services/login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotaService } from '../../core/services/nota.service';
import { NotaInterface } from '../../core/interfaces/nota.interface';
import { AlunoService } from '../../core/services/aluno.service';
import { UsuarioInterface } from '../../core/interfaces/usuario.interface';
import { AlunoInterface } from '../../core/interfaces/aluno.interface';
import { MateriaService } from '../../core/services/materia.service';
import { MateriaInterface } from '../../core/interfaces/materia.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  perfilAtivo!: string;
  listaNotas: NotaInterface[] = [];
  listaMaterias: MateriaInterface[] = [];
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

  constructor(
    private loginService: LoginService,
    private alunoService: AlunoService,
    private notaService: NotaService,
    private materiaService: MateriaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.perfilAtivo = this.loginService.perfilUsuarioAtivo;
    this.usuarioLogado = this.loginService.usuarioLogado;

    this.alunoService
      .getAlunoByEmail(this.usuarioLogado.email)
      .subscribe((retorno) => {
        if (retorno.length > 0) this.alunoAtivo = retorno[0];

        if (this.alunoAtivo) {
          this.getNotasAluno();
        }
      });
  }

  pesquisar() {}

  verDetalhes() {}

  lancarNota() {}

  getNotasAluno() {
    this.notaService
      .getNotasByAluno(this.alunoAtivo.id)
      .subscribe((retorno) => {
        this.listaNotas = retorno;
        let idMaterias = retorno.map((item) => {
          return item.materia;
        });
        this.getMateriasAluno(idMaterias);
      });
  }

  getMateriasAluno(ids: Array<string>) {
    this.materiaService.getMaterias().subscribe((retorno) => {
      this.listaMaterias = retorno.filter((item) => {
        return ids.includes(item.id);
      });
    });
  }

  getNomeMaterias(idMateria: string) {
    let materia = this.listaMaterias.filter((item) => {
      return item.id == idMateria;
    });
    if (materia.length == 0) {
      return 'Matéria não encontrada!';
    }
    return materia[0].nome;
  }
}
