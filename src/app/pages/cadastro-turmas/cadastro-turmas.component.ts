import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-turmas',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cadastro-turmas.component.html',
  styleUrl: './cadastro-turmas.component.scss',
})
export class CadastroTurmasComponent {
  formTurma!: FormGroup;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.formTurma = new FormGroup({
      nomeTurma: new FormControl('', Validators.required),
      dataInicio: new FormControl('', Validators.required),
      dataTermino: new FormControl('', Validators.required),
      horario: new FormControl('', Validators.required),
      professor: new FormControl('', Validators.required),
    });
  }

  submitForm() {
    window.alert('Dados gravados com sucesso!');
  }

  cancelar() {
    this.formTurma.reset();
    this.router.navigate(['/home']);
  }
}
