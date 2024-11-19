export interface TurmaInterface {
  id: number;
  nomeTurma: string;
  dataInicio: Date;
  dataTermino: Date;
  horario: string;
  docenteId: number;
  cursoId: number;
}
