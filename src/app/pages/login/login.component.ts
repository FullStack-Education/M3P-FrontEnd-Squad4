import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { ToastrService } from 'ngx-toastr';

import { LoginService } from '../../core/services/login.service';

import { DialogComponent } from '../../shared/components/dialog/dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  formLogin!: FormGroup;

  constructor(
    private loginService: LoginService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formLogin = new FormGroup({
      email: new FormControl('', Validators.required),
      senha: new FormControl('', Validators.required),
    });
  }

  entrar() {
    if (this.formLogin.value) {
      const retorno = this.loginService.logar(this.formLogin.value);
      if (retorno) {
        this.router.navigate(['/home']);
        this.toastr.success('Login efetuado com sucesso!');
      } else {
        this.formLogin.reset();
        this.toastr.error('Usuário ou senha incorretos!');
      }
    } else {
      this.toastr.warning('Por favor, preencha todos os campos!');
    }
  }

  criarConta() {
    this.dialog.open(DialogComponent, {
      data: {
        titulo: 'Criar Conta',
        mensagem: 'Funcionalidade em desenvolvimento!',
        btCancelar: 'Fechar',
      },
    });
  }

  recuperarSenha() {
    this.dialog.open(DialogComponent, {
      data: {
        titulo: 'Recuperar Senha',
        mensagem:
          'Processo de recuperação de senha enviado para o e-mail cadastrado!',
        btCancelar: 'Fechar',
      },
    });
  }
}
