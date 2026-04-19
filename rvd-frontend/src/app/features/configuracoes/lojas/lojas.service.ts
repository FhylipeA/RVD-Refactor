import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Loja {
  idloja: number;
  nome: string;
  dePara_LinxDms: string;
  bandeira_idbandeira: number | null;
  ativo: boolean;
  rvdVendas: RvdVendaConfig[];
}

export interface RvdVendaConfig {
  id: number;
  departamento_iddepartamento: string;
  descricao_departamento: string;
  legado: string;
  loja_nome_bandeira: string | null;
  ativo: boolean;
  loja_idloja: number;
}

export interface CreateLojaPayload {
  nome: string;
  dePara_LinxDms: string;
  bandeira_idbandeira?: number;
}

export interface CreateDepPayload {
  departamento_iddepartamento: string;
  descricao_departamento: string;
  legado: string;
  loja_nome_bandeira?: string;
}

@Injectable({ providedIn: 'root' })
export class LojasService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/lojas';

  async getAll(): Promise<Loja[]> {
    return firstValueFrom(this.http.get<Loja[]>(this.base));
  }

  async create(payload: CreateLojaPayload): Promise<Loja> {
    return firstValueFrom(this.http.post<Loja>(this.base, payload));
  }

  async update(id: number, payload: Partial<CreateLojaPayload>): Promise<Loja> {
    return firstValueFrom(this.http.patch<Loja>(`${this.base}/${id}`, payload));
  }

  async remove(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.base}/${id}`));
  }

  async addDepartamento(lojaId: number, payload: CreateDepPayload): Promise<Loja> {
    return firstValueFrom(
      this.http.post<Loja>(`${this.base}/${lojaId}/departamentos`, payload)
    );
  }

  async updateDepartamento(
    lojaId: number,
    depId: number,
    payload: Partial<CreateDepPayload>,
  ): Promise<Loja> {
    return firstValueFrom(
      this.http.patch<Loja>(`${this.base}/${lojaId}/departamentos/${depId}`, payload)
    );
  }

  async removeDepartamento(lojaId: number, depId: number): Promise<Loja> {
    return firstValueFrom(
      this.http.delete<Loja>(`${this.base}/${lojaId}/departamentos/${depId}`)
    );
  }
}