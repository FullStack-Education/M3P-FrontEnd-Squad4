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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  formLogin!: FormGroup;

  constructor(private loginService: LoginService, private router: Router) {}

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
      } else {
        this.formLogin.reset();
      }
    } else {
      window.alert('Por favor, preencha os campos');
    }
  }

  criarConta() {
    window.alert('Funcionalidade em desenvolvimento!');
  }

  recuperarSenha() {
    window.alert(
      'Processo de recuperação de senha enviado para o e-mail cadastrado!'
    );
  }
}
