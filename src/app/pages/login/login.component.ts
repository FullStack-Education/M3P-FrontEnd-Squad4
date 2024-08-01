import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../core/services/login.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { MatButtonModule } from '@angular/material/button';

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
    private router: Router,
    private dialog: MatDialog
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
        this.dialog.open(DialogComponent, {
          data: {
            titulo: 'Sucesso',
            mensagem: 'Usuário logado com sucesso!',
            btCancelar: 'Fechar',
          },
        });
      } else {
        this.formLogin.reset();
        this.dialog.open(DialogComponent, {
          data: {
            titulo: 'Login Inválido',
            mensagem: 'Usuário ou senha incorretos!',
            btCancelar: 'Fechar',
          },
        });
      }
    } else {
      this.dialog.open(DialogComponent, {
        data: {
          titulo: 'Dados Incompletos',
          mensagem: 'Por favor, preencha os campos.',
          btCancelar: 'Fechar',
        },
      });
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
