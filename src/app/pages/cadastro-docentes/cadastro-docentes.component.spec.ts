import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroDocentesComponent } from './cadastro-docentes.component';

describe('CadastroDocentesComponent', () => {
  let component: CadastroDocentesComponent;
  let fixture: ComponentFixture<CadastroDocentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroDocentesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroDocentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
