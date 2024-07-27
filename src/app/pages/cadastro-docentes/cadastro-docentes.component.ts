import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CepService } from '../../core/services/cep.service';

@Component({
  selector: 'app-cadastro-docentes',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cadastro-docentes.component.html',
  styleUrl: './cadastro-docentes.component.scss',
})
export class CadastroDocentesComponent implements OnInit {
  formDocente!: FormGroup;

  constructor(private router: Router, private cepService: CepService) {}

  ngOnInit(): void {
    this.formDocente = new FormGroup({
      nomeCompleto: new FormControl('', Validators.required),
      genero: new FormControl('', Validators.required),
      nascimento: new FormControl('', Validators.required),
      cpf: new FormControl('', Validators.required),
      rg: new FormControl('', Validators.required),
      estadoCivil: new FormControl('', Validators.required),
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
      materias: new FormControl('', Validators.required),
    });
  }
  buscarCep() {
    if (this.formDocente.value.cep) {
      this.cepService.buscarCep(this.formDocente.value.cep).subscribe({
        next: (retorno) => {
          if ((retorno as any).erro) {
            window.alert('CEP digitado inválido');
          } else {
            this.formDocente.patchValue(retorno);
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
    this.formDocente.reset();
    this.router.navigate(['/home']);
  }
}
