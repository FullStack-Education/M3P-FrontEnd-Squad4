import { Injectable } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  private _opened = new BehaviorSubject<boolean>(false);
  opened$ = this._opened.asObservable();

  sidenavMode: MatDrawerMode = 'side';

  toggle(): void {
    this._opened.next(!this._opened.value);
  }

  close(): void {
    this._opened.next(false);
  }

  setSidenavMode(mode: MatDrawerMode): void {
    this.sidenavMode = mode;
  }
}
