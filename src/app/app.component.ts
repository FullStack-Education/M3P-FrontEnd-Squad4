import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MenuLateralComponent } from './shared/components/menu-lateral/menu-lateral.component';
import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';
import { CommonModule } from '@angular/common';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { SidenavService } from './core/services/sidenav.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  sidenavMode: MatDrawerMode = 'side';
  showMenuLateral = true;
  showToolbar = true;
  opened = true;

  constructor(
    private router: Router,
    private sidenavService: SidenavService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.router.events.subscribe((retorno) => {
      if (retorno instanceof NavigationEnd) {
        this.showMenuLateral = !this.router.url.includes('login');
        this.showToolbar = !this.router.url.includes('login');
      }
    });

    this.sidenavService.opened$.subscribe((isOpened) => {
      this.opened = isOpened;
    });
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 1024px)'])
      .subscribe((result) => {
        if (result.breakpoints['(max-width: 1024px)']) {
          this.sidenavMode = 'over';
          this.opened = false;
        } else {
          this.sidenavMode = 'side';
          this.opened = true;
        }
        this.sidenavService.setSidenavMode(this.sidenavMode);
      });
  }
}
