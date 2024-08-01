import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-notas',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule],
  templateUrl: './cadastro-notas.component.html',
  styleUrl: './cadastro-notas.component.scss',
})
export class CadastroNotasComponent {
  formNota!: FormGroup;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.formNota = new FormGroup({
      professor: new FormControl('', Validators.required),
      materia: new FormControl('', Validators.required),
      avaliacao: new FormControl('', Validators.required),
      data: new FormControl('', Validators.required),
      aluno: new FormControl('', Validators.required),
      nota: new FormControl('', Validators.required),
    });
  }

  submitForm() {
    window.alert('Dados gravados com sucesso!');
  }

  cancelar() {
    this.formNota.reset();
    this.router.navigate(['/home']);
  }
}
