export interface CreateLojaDto {
  nome: string;
  dePara_LinxDms: string;
  bandeira_idbandeira?: number;
  ativo?: boolean;
  departamentos?: CreateRvdVendaConfigDto[];
}

export interface UpdateLojaDto {
  nome?: string;
  dePara_LinxDms?: string;
  bandeira_idbandeira?: number;
  ativo?: boolean;
}

export interface CreateRvdVendaConfigDto {
  departamento_iddepartamento: string;
  descricao_departamento: string;
  legado: string;
  loja_nome_bandeira?: string;
  ativo?: boolean;
}

export interface UpdateRvdVendaConfigDto {
  descricao_departamento?: string;
  legado?: string;
  loja_nome_bandeira?: string;
  ativo?: boolean;
}

export interface LojaResponse {
  idloja: number;
  nome: string;
  dePara_LinxDms: string;
  bandeira_idbandeira: number | null;
  ativo: boolean;
  rvdVendas: RvdVendaConfigResponse[];
}

export interface RvdVendaConfigResponse {
  id: number;
  departamento_iddepartamento: string;
  descricao_departamento: string;
  legado: string;
  loja_nome_bandeira: string | null;
  ativo: boolean;
  loja_idloja: number;
}