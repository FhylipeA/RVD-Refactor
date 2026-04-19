export interface FindVendasBody {
    idLoja: number;
    dePara_LinxDms: string;
    periodo: string;
    integracao: Integracao;
}
export interface Integracao {
    departamento: string;
    departamento_iddepartamento: string;
    desc_integracao: string;
    indice: number;
    integracao: string;
    legado: string;
    legados_idlegados: number;
    loja_idloja: number;
    nome: string;
    sistema_legado: string;
    tipo: string;
    tipo_integracao_idtipo_integracao: number;
    ativo: boolean;
    loja_nome_bandeira: string;
    dePara_LinxDms: string;
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
