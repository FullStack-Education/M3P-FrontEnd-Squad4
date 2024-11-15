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
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../core/services/login.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { ErroFormComponent } from '../../shared/components/erro-form/erro-form.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    ErroFormComponent,
  ],
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
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', Validators.required),
    });
  }

  entrar() {
    if (this.formLogin.valid) {
      const { email, senha } = this.formLogin.value;

      this.loginService.logar({ email, senha }).subscribe({
        next: (loginSucesso) => {
          if (loginSucesso) {
            this.router.navigate(['/home']);
            this.toastr.success('Login efetuado com sucesso!');
          } else {
            this.formLogin.reset();
            this.toastr.error('Usuário e/ou senha incorretos!');
          }
        },
        error: (erro) => {
          console.error('Erro na requisição de login:', erro);
          this.toastr.error(
            'Erro ao tentar fazer login. Tente novamente mais tarde.'
          );
        },
      });
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
        mensagem: 'Funcionalidade em desenvolvimento!',
        btCancelar: 'Fechar',
      },
    });
  }
}
