import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListagemNotasComponent } from './listagem-notas.component';

describe('ListagemNotasComponent', () => {
  let component: ListagemNotasComponent;
  let fixture: ComponentFixture<ListagemNotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListagemNotasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListagemNotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
