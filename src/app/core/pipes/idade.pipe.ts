import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'idadePipe',
  standalone: true,
})
export class IdadePipe implements PipeTransform {
  transform(nascimento: string | Date | undefined, ...args: unknown[]): any {
    if (!nascimento) {
      return null;
    }

    const dataNascimento = moment(nascimento, 'YYYY-MM-DD');
    if (!dataNascimento.isValid()) {
      return null;
    }

    let hoje = moment();
    return hoje.diff(dataNascimento, 'years');
  }
}
