import { Component, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { MenuLateralComponent } from './shared/components/menu-lateral/menu-lateral.component';
import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';
import { CommonModule } from '@angular/common';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { SidenavService } from './core/services/sidenav.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { LoadingService } from './core/services/loading.service';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { LoginService } from './core/services/login.service';
import { UsuarioInterface } from './core/interfaces/usuario.interface';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MenuLateralComponent,
    ToolbarComponent,
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    LoadingComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Projeto LabPCP';
  sidenavMode: MatDrawerMode = 'side';
  showMenuLateral = true;
  showToolbar = true;
  opened = true;
  usuarioLogado: UsuarioInterface | null = null;
  private navigationCount = 0;
  private usuarioSubscription!: Subscription;

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private sidenavService: SidenavService,
    private breakpointObserver: BreakpointObserver,
    private loginService: LoginService,
    private toastr: ToastrService
  ) {
    this.router.events.subscribe({
      next: (retorno) => {
        if (retorno instanceof NavigationEnd) {
          this.showMenuLateral = !this.router.url.includes('login');
          this.showToolbar = !this.router.url.includes('login');
        }
      },
      error: (erro) => {
        this.toastr.error('Ocorreu um erro!');
        console.error(erro);
      },
    });

    this.sidenavService.opened$.subscribe({
      next: (isOpened) => {
        this.opened = isOpened;
      },
      error: (erro) => {
        this.toastr.error('Ocorreu um erro!');
        console.error(erro);
      },
    });
  }

  ngOnInit(): void {
    this.usuarioSubscription = this.loginService.usuarioLogado$.subscribe({
      next: (usuario) => {
        this.usuarioLogado = usuario;
      },
      error: (erro) => {
        this.toastr.error('Ocorreu um erro ao logar!');
        console.error(erro);
      },
    });

    this.router.events.subscribe({
      next: (event) => {
        if (event instanceof NavigationStart) {
          this.navigationCount++;
          this.loadingService.show();
        }
        if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.navigationCount--;
          if (this.navigationCount === 0) {
            this.loadingService.hide();
          }
        }
      },
      error: (erro) => {
        this.toastr.error('Ocorreu um erro!');
        console.error(erro);
      },
    });

    this.breakpointObserver.observe(['(max-width: 1024px)']).subscribe({
      next: (result) => {
        if (result.breakpoints['(max-width: 1024px)']) {
          this.sidenavMode = 'over';
          this.opened = false;
        } else {
          this.sidenavMode = 'side';
          this.opened = true;
        }
        this.sidenavService.setSidenavMode(this.sidenavMode);
      },
      error: (erro) => {
        this.toastr.error('Ocorreu um erro!');
        console.error(erro);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.usuarioSubscription) {
      this.usuarioSubscription.unsubscribe();
    }
  }
}
