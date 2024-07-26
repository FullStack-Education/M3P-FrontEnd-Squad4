import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListagemDocentesComponent } from './listagem-docentes.component';

describe('ListagemDocentesComponent', () => {
  let component: ListagemDocentesComponent;
  let fixture: ComponentFixture<ListagemDocentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListagemDocentesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListagemDocentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
