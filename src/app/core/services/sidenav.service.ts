import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  private _opened = new BehaviorSubject<boolean>(false);
  opened$ = this._opened.asObservable();

  toggle(): void {
    this._opened.next(!this._opened.value);
  }
}
