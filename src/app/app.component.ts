import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MenuLateralComponent } from './shared/components/menu-lateral/menu-lateral.component';
import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuLateralComponent, ToolbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  showMenuLateral = true;
  showToolbar = true;

  constructor(private router: Router) {
    this.router.events.subscribe((retorno) => {
      if (retorno instanceof NavigationEnd) {
        this.showMenuLateral = !this.router.url.includes('login');
        this.showToolbar = !this.router.url.includes('login');
      }
    });
  }
}
