import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErroFormComponent } from './erro-form.component';

describe('ErroFormComponent', () => {
  let component: ErroFormComponent;
  let fixture: ComponentFixture<ErroFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErroFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ErroFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
