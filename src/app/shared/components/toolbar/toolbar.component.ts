import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoginService } from '../../../core/services/login.service';
import { SidenavService } from '../../../core/services/sidenav.service';
import { DialogComponent } from '../dialog/dialog.component';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent implements OnInit {
  usuarioAtivo = {
    nome: '',
    avatar: '',
  };

  private subscription: Subscription = new Subscription();

  constructor(
    private loginService: LoginService,
    private sidenavService: SidenavService,
    private dialog: MatDialog,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.loginService.usuarioLogado$.subscribe({
        next: (usuarioLogado) => {
          if (usuarioLogado) {
            this.usuarioAtivo.nome = usuarioLogado.nome;
            // this.usuarioAtivo.avatar = usuarioLogado.avatar;
          }
        },
        error: (erro) => {
          this.toastr.error('Ocorreu um erro ao logar!');
          console.error(erro);
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleSidenav(): void {
    this.sidenavService.toggle();
  }

  sair() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        titulo: 'Sair do Sistema',
        mensagem: 'Você tem certeza que deseja sair do sistema?',
        btConfirmar: 'Confirmar',
        btCancelar: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (retorno) => {
        if (retorno) {
          this.loginService.deslogar();
          this.router.navigate(['/login']);
        } else {
          return;
        }
      },
      error: (erro) => {
        this.toastr.error('Ocorreu um erro!');
        console.error(erro);
      },
    });
  }
}
