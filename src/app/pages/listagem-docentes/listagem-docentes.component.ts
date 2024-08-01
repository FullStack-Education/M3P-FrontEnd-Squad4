import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-listagem-docentes',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './listagem-docentes.component.html',
  styleUrl: './listagem-docentes.component.scss',
})
export class ListagemDocentesComponent {
  pesquisar() {}
}
