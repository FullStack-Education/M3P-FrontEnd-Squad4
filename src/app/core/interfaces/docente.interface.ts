export interface DocenteInterface {
  id: number;
  nomeCompleto: string;
  genero: string;
  nascimento: Date;
  cpf: string;
  rg: string;
  estadoCivil: string;
  telefone: string;
  email: string;
  senha: string;
  naturalidade: string;
  cep: number;
  localidade: string;
  uf: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  referencia: string;
  materias: number[];
}
