export interface RvdVenda {
  id: number;
  loja_idloja: number;
  departamento_iddepartamento: string;
  chassi: string | null;
  nro_proposta: number | null;
  empresa_origem_proposta: number | null;
  revenda_origem_proposta: number | null;
  chave_proposta_loja_dms: string;
  id_usuario_dms: number | null;
  nome_usuario_dms: string | null;
  cpf_usuario_dms: number | null;
  departamento_usuario_dms: number | null;
  time_venda_dms: number | null;
  nome_time_venda_dms: string | null;
  status_a_faturar: StatusAFaturar | null;
  veiculo_capturado: string | null;
  valor_sinal: number | null;
  valor_compra: number | null;
  correcao_faturamento: number | null;
  bonus: number | null;
  outros_bonus: number | null;
  bonus_complementar: number | null;
  tipo_bonus_complementar: string | null;
  acessorios: number | null;
  acessorios_nf: number | null;
  outros_nf: number | null;
  brinde: number | null;
  valor_financiado: number | null;
  banco: string | null;
  valor_consorcio: number | null;
  consorcio: string | null;
  tabela: number | null;
  despachante: number | null;
  seguro: number | null;
  despesas_vendas: number | null;
  plus_antecipado: number | null;
  top: number | null;
  devolucao: boolean;
  a_faturar_premium: AFaturarPremium | null;
  historico: HistoricoModificacao[] | null;
  created_at: string;
  maisInformacoes?: MaisInformacoes;
}

export type StatusAFaturar = 'REALIZADO' | 'PENDENTE' | 'DEVOLVIDO';

export interface AFaturarPremium {
  dta_venda: string;
  dta_nf: string | null;
  tipo_veiculo: 'CARRO' | 'MOTO';
  dta_entrada_estoque: string | null;
  venda_nro: number | null;
  nf_nro: number | null;
  pedido: string;
  cliente: string;
  modelo: string;
  tipo_venda: string;
  local_venda: string;
  valor_nota_venda: number;
  valor_nf_fabrica: number | null;
}

export interface HistoricoModificacao {
  data: string;
  usuario: string;
  descricao: {
    valor_sinal: number;
    valor_compra: number | null;
    veiculo_capturado: string | null;
    correcao_faturamento: number;
    bonus: number;
    outros_bonus: number;
    acessorios: number;
    valor_financiado: number;
    acessorios_nf: number;
    outros_nf: number;
    brinde: number;
    banco: string | null;
    consorcio: string | null;
    valor_consorcio: number;
    tabela: number | null;
    despachante: number;
    seguro: number;
  };
}

export interface MaisInformacoes {
  dtaAberturaProposta: string | null;
  modelo: string | null;
  status: string;
  nomeCliente: string | null;
  nomeVendedor: string | null;
  idVendedor: number | null;
  diasEstoque: number | null;
  diasAteFaturar: number | null;
  nfNo: number | null;
  valorNfFabrica: number | null;
  valorNotaVenda: number | null;
}

export interface FiltrosTabela {
  global: string;
  status: string;
  vendedor: string;
  statusAFaturar: string;
}

export const COLUNAS_DEFAULT: string[] = [
  'info', 'chassi', 'nro_proposta', 'nome_usuario_dms', 'nomeCliente',
  'status', 'status_a_faturar', 'valor_sinal', 'valor_compra',
  'veiculo_capturado', 'correcao_faturamento', 'bonus', 'outros_bonus',
  'acessorios_nf', 'outros_nf', 'brinde', 'valor_financiado', 'banco',
  'valor_consorcio', 'consorcio', 'tabela', 'despachante', 'acessorios',
  'seguro', 'top'
];

export const COLUNAS_GM: string[] = [
  'info', 'chassi', 'nro_proposta', 'nome_usuario_dms', 'nomeCliente',
  'status', 'status_a_faturar', 'valor_sinal', 'valor_compra',
  'veiculo_capturado', 'correcao_faturamento', 'bonus', 'outros_bonus',
  'bonus_complementar', 'tipo_bonus_complementar', 'acessorios_nf',
  'outros_nf', 'brinde', 'valor_financiado', 'banco', 'valor_consorcio',
  'consorcio', 'tabela', 'despachante', 'acessorios', 'seguro',
  'despesas_vendas', 'top'
];

export const COLUNAS_HYUNDAI: string[] = [
  'info', 'chassi', 'nro_proposta', 'nome_usuario_dms', 'nomeCliente',
  'status', 'status_a_faturar', 'valor_sinal', 'valor_compra',
  'veiculo_capturado', 'correcao_faturamento', 'bonus', 'outros_bonus',
  'acessorios_nf', 'outros_nf', 'brinde', 'valor_financiado', 'banco',
  'valor_consorcio', 'consorcio', 'tabela', 'despachante', 'acessorios',
  'seguro', 'despesas_vendas', 'plus_antecipado', 'top'
];

export const COLUNAS_NBS: string[] = [
  'info', 'chassi', 'nro_proposta', 'nome_usuario_dms', 'nomeCliente',
  'status', 'status_a_faturar', 'veiculo_capturado', 'valor_sinal',
  'bonus', 'outros_bonus', 'tipo_bonus_complementar', 'valor_compra',
  'acessorios_nf', 'outros_nf', 'brinde', 'valor_financiado', 'banco',
  'tabela', 'acessorios', 'despachante', 'seguro', 'despesas_vendas', 'top'
];