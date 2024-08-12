import { Injectable } from '@angular/core';
import { BehaviorSubject, timer, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _loading = new BehaviorSubject<boolean>(false);
  private _hide = new Subject<void>();
  public readonly loading$ = this._loading.asObservable();

  private minDisplayTime = 300; // Tempo mínimo de exibição em milissegundos
  private hideTimer?: any;

  show(): void {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = undefined;
    }
    this._loading.next(true);
  }

  hide(): void {
    if (this._loading.value) {
      this.hideTimer = setTimeout(() => {
        this._loading.next(false);
      }, this.minDisplayTime);
    }
  }
}
