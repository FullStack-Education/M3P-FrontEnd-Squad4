import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroTurmasComponent } from './cadastro-turmas.component';

describe('CadastroTurmasComponent', () => {
  let component: CadastroTurmasComponent;
  let fixture: ComponentFixture<CadastroTurmasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroTurmasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroTurmasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
