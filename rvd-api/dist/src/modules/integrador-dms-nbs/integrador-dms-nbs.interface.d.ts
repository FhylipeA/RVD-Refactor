export interface VendaNbs {
    idEmpresa: number;
    empresa: string;
    dtaAberturaProposta: string | null;
    dataDaNf: string | null;
    dataEntradaEstoque: string | null;
    diasEstoque: number | null;
    nomeVendedor: string | null;
    departamentoVendedor: string | null;
    descricaoDepartamentoVendedor: string | null;
    timeVenda: string | null;
    desTimeVenda: string | null;
    idVendedor: number | null;
    cpfVendedor: string | null;
    nfNo: number | null;
    chassi: string | null;
    proposta: number | null;
    propostaDev: number | null;
    nomeCliente: string | null;
    modelo: string | null;
    tipoDeModelo: string | null;
    precoSugerido: number | null;
    valorNotaVenda: number | null;
    valorNfFabrica: number | null;
    diasAteFaturar: number | null;
    status: string;
}
export interface VendedorNbs {
    empresa: number;
    timeVendaDms: string;
    departamentoUsuarioDms: string;
    nomeTimeVendaDms: string;
    nome: string;
    cpfUsuario: string;
    idVendedor: number;
}
