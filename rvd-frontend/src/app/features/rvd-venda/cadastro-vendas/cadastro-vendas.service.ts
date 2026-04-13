import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type { RvdVenda } from '../interfaces/rvd-venda.interface';

@Injectable({
  providedIn: 'root'
})
export class CadastroVendasService {
  private readonly baseUrl = '/api/rvd-venda';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') ?? '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  async getVendasRvd(
    idLoja: number,
    dePara_LinxDms: string,
    periodo: string,
    integracao: any
  ): Promise<{ response: RvdVenda[]; enableAFaturarPremium: boolean }> {
    return firstValueFrom(
      this.http.post<{ response: RvdVenda[]; enableAFaturarPremium: boolean }>(
        `${this.baseUrl}/find-vendas`,
        { idLoja, dePara_LinxDms, periodo, integracao },
        { headers: this.getHeaders() }
      )
    );
  }

  async createOrUpdateVendas(vendas: RvdVenda[]): Promise<void> {
    return firstValueFrom(
      this.http.post<void>(
        `${this.baseUrl}/update-vendas`,
        { vendas },
        { headers: this.getHeaders() }
      )
    );
  }

  async createManualInsert(data: Partial<RvdVenda>): Promise<RvdVenda> {
    return firstValueFrom(
      this.http.post<RvdVenda>(
        `${this.baseUrl}/create-manual-insert`,
        data,
        { headers: this.getHeaders() }
      )
    );
  }

  async updateVendaManual(
    rvdVendaManual: Partial<RvdVenda>,
    rvdVendaManualUpdated: Partial<RvdVenda>
  ): Promise<RvdVenda> {
    return firstValueFrom(
      this.http.patch<RvdVenda>(
        `${this.baseUrl}/update-manual-insert`,
        { rvdVendaManual, rvdVendaManualUpdated },
        { headers: this.getHeaders() }
      )
    );
  }

  async removeByStoreAndProposalKey(
    loja: number,
    chaveProposta: string
  ): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(
        `${this.baseUrl}/loja/${loja}/chave-proposta/${chaveProposta}`,
        { headers: this.getHeaders() }
      )
    );
  }

  async getVendedoresBI(integracao: any): Promise<any[]> {
    return firstValueFrom(
      this.http.post<any[]>(
        `${this.baseUrl}/get-vendedores`,
        { integracao },
        { headers: this.getHeaders() }
      )
    );
  }

  async validaAFaturarPremium(integracao: any): Promise<boolean> {
    return firstValueFrom(
      this.http.post<boolean>(
        `${this.baseUrl}/valida-premium`,
        { integracao },
        { headers: this.getHeaders() }
      )
    );
  }

  async getBancos(): Promise<{ nome: string }[]> {
    return firstValueFrom(
      this.http.get<{ nome: string }[]>(
        `${this.baseUrl}/bancos`,
        { headers: this.getHeaders() }
      )
    );
  }

  async getConsorcios(): Promise<{ id: number; consorcio: string }[]> {
    return firstValueFrom(
      this.http.get<{ id: number; consorcio: string }[]>(
        `${this.baseUrl}/consorcios`,
        { headers: this.getHeaders() }
      )
    );
  }
}