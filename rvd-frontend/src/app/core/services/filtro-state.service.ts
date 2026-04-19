import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FiltroStateService {
  lojaSelecionada = signal<any>(null);
  departamentoSelecionado = signal<any>(null);
  dataSelecionada = signal<Date>(new Date());
  buscarTrigger = signal<number>(0);

  setLoja(loja: any) {
    this.lojaSelecionada.set(loja);
    this.departamentoSelecionado.set(null);
  }

  setDepartamento(dep: any) {
    this.departamentoSelecionado.set(dep);
  }

  setData(data: Date) {
    this.dataSelecionada.set(data);
  }

  triggerBuscar() {
    this.buscarTrigger.update(v => v + 1);
  }
}