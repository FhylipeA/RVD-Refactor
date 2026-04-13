export interface Historico {
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

export type StatusAFaturar = 'REALIZADO' | 'PENDENTE' | 'DEVOLVIDO';