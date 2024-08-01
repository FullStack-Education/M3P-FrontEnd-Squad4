import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CepService } from '../../core/services/cep.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cadastro-alunos',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule],
  templateUrl: './cadastro-alunos.component.html',
  styleUrl: './cadastro-alunos.component.scss',
})
export class CadastroAlunosComponent {
  formAluno!: FormGroup;

  constructor(private router: Router, private cepService: CepService) {}

  ngOnInit(): void {
    this.formAluno = new FormGroup({
      nomeCompleto: new FormControl('', Validators.required),
      genero: new FormControl('', Validators.required),
      nascimento: new FormControl('', Validators.required),
      cpf: new FormControl('', Validators.required),
      rg: new FormControl('', Validators.required),
      telefone: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      senha: new FormControl('', Validators.required),
      naturalidade: new FormControl('', Validators.required),
      cep: new FormControl('', Validators.required),
      localidade: new FormControl('', Validators.required),
      uf: new FormControl('', Validators.required),
      logradouro: new FormControl('', Validators.required),
      numero: new FormControl('', Validators.required),
      complemento: new FormControl('', Validators.required),
      bairro: new FormControl('', Validators.required),
      referencia: new FormControl('', Validators.required),
      turma: new FormControl('', Validators.required),
    });
  }
  buscarCep() {
    if (this.formAluno.value.cep) {
      this.cepService.buscarCep(this.formAluno.value.cep).subscribe({
        next: (retorno) => {
          if ((retorno as any).erro) {
            window.alert('CEP digitado inválido');
          } else {
            this.formAluno.patchValue(retorno);
          }
        },
        error: (err) => {
          window.alert('Ocorreu um erro ao buscar o CEP digitado');
          console.log(err);
        },
      });
    }
  }

  submitForm() {
    window.alert('Dados gravados com sucesso!');
  }

  cancelar() {
    this.formAluno.reset();
    this.router.navigate(['/home']);
  }
}
