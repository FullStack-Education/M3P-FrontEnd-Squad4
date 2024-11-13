import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../core/services/login.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginServiceMock: any;
  let dialogMock: any;
  let toastrMock: any;
  let routerMock: any;

  beforeEach(async () => {
    loginServiceMock = jasmine.createSpyObj('LoginService', ['logar']);
    dialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    toastrMock = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
      'warning',
    ]);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: LoginService, useValue: loginServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: ToastrService, useValue: toastrMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário no ngOnInit', () => {
    component.ngOnInit();
    expect(component.formLogin).toBeDefined();
    expect(component.formLogin.controls['email']).toBeDefined();
    expect(component.formLogin.controls['senha']).toBeDefined();
  });

  it('deve exibir uma mensagem de aviso se o formulário for inválido ao enviar', () => {
    component.formLogin.controls['email'].setValue('');
    component.formLogin.controls['senha'].setValue('');
    component.entrar();
    expect(toastrMock.warning).toHaveBeenCalledWith(
      'Por favor, preencha todos os campos!'
    );
  });

  it('deve chamar loginService.logar com credenciais corretas se o formulário for válido', () => {
    component.formLogin.controls['email'].setValue('admin@mail.com');
    component.formLogin.controls['senha'].setValue('senhaSegura123');
    loginServiceMock.logar.and.returnValue(of(true));

    component.entrar();

    expect(loginServiceMock.logar).toHaveBeenCalledWith({
      email: 'admin@mail.com',
      senha: 'senhaSegura123',
    });
  });

  it('deve navegar até a página inicial e mostrar a mensagem de sucesso no login bem-sucedido', () => {
    component.formLogin.controls['email'].setValue('admin@mail.com');
    component.formLogin.controls['senha'].setValue('senhaSegura123');
    loginServiceMock.logar.and.returnValue(of(true));

    component.entrar();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
    expect(toastrMock.success).toHaveBeenCalledWith(
      'Login efetuado com sucesso!'
    );
  });

  it('deve redefinir o formulário e mostrar mensagem de erro em caso de login malsucedido', () => {
    component.formLogin.controls['email'].setValue('admin@mail.com');
    component.formLogin.controls['senha'].setValue('outraSenha');
    loginServiceMock.logar.and.returnValue(of(false));

    component.entrar();

    expect(component.formLogin.value).toEqual({ email: null, senha: null });
    expect(toastrMock.error).toHaveBeenCalledWith(
      'Usuário e/ou senha incorretos!'
    );
  });

  it('deve mostrar mensagem de erro em caso de falha na solicitação de login', () => {
    component.formLogin.controls['email'].setValue('admin@mail.com');
    component.formLogin.controls['senha'].setValue('senhaSegura123');
    loginServiceMock.logar.and.returnValue(
      throwError(() => new Error('Erro na requisição'))
    );

    component.entrar();

    expect(toastrMock.error).toHaveBeenCalledWith(
      'Erro ao tentar fazer login. Tente novamente mais tarde.'
    );
  });

  it('deve abrir a caixa de diálogo para criar conta', () => {
    component.criarConta();
    expect(dialogMock.open).toHaveBeenCalledWith(jasmine.any(Function), {
      data: {
        titulo: 'Criar Conta',
        mensagem: 'Funcionalidade em desenvolvimento!',
        btCancelar: 'Fechar',
      },
    });
  });

  it('deve abrir a caixa de diálogo para recuperação de senha', () => {
    component.recuperarSenha();
    expect(dialogMock.open).toHaveBeenCalledWith(jasmine.any(Function), {
      data: {
        titulo: 'Recuperar Senha',
        mensagem: 'Funcionalidade em desenvolvimento!',
        btCancelar: 'Fechar',
      },
    });
  });
});
