import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { usuarioLogadoGuard } from './usuario-logado.guard';

describe('usuarioLogadoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => usuarioLogadoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
