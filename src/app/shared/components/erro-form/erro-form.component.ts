import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-erro-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './erro-form.component.html',
  styleUrl: './erro-form.component.scss',
})
export class ErroFormComponent {
  @Input() control!: AbstractControl;
  @Input() customMessages: { [key: string]: string } = {};

  get errorMessages(): string[] {
    if (
      !this.control ||
      !this.control.errors ||
      !(this.control.touched || this.control.dirty)
    ) {
      return [];
    }

    return this.getErrorMessages();
  }

  private getErrorMessages(): string[] {
    const errors: ValidationErrors = this.control.errors || {};
    return Object.keys(errors).map(
      (errorKey) =>
        this.customMessages[errorKey] || this.getDefaultErrorMessage(errorKey)
    );
  }

  private getDefaultErrorMessage(errorKey: string): string {
    const defaultMessages: { [key: string]: string } = {
      required: 'Campo obrigatório',
      email: 'Email inválido',
      minlength: 'Tamanho mínimo não atingido',
      maxlength: 'Tamanho máximo excedido',
      pattern: 'Formato inválido',
    };
    return defaultMessages[errorKey] || 'Erro desconhecido';
  }
}
