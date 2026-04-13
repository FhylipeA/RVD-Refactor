import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'brl',
  standalone: true,
})
export class BrlCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) return '—';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(Number(value));
  }
}