"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CadastroVendasService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CadastroVendasService = void 0;
const common_1 = require("@nestjs/common");
const rvd_venda_service_1 = require("../rvd-venda/rvd-venda.service");
const integrador_dms_nbs_service_1 = require("../integrador-dms-nbs/integrador-dms-nbs.service");
let CadastroVendasService = CadastroVendasService_1 = class CadastroVendasService {
    rvdVendaService;
    integradorNbs;
    logger = new common_1.Logger(CadastroVendasService_1.name);
    constructor(rvdVendaService, integradorNbs) {
        this.rvdVendaService = rvdVendaService;
        this.integradorNbs = integradorNbs;
    }
    validaAFaturarPremium(integracao) {
        return (integracao.legado === 'NBS' ||
            integracao.loja_nome_bandeira === 'AUDI' ||
            (integracao.loja_nome_bandeira === 'TOYOTA' &&
                integracao.departamento_iddepartamento === 'S') ||
            (integracao.loja_nome_bandeira === 'LEXUS' &&
                integracao.departamento_iddepartamento === 'S') ||
            (integracao.loja_nome_bandeira === 'HYUNDAI' &&
                integracao.departamento_iddepartamento === 'S'));
    }
    async findVendasVeiculos(idLoja, periodo, integracao) {
        try {
            const enableAFaturarPremium = this.validaAFaturarPremium(integracao);
            const codEmpresa = integracao.dePara_LinxDms;
            const departamento = integracao.departamento_iddepartamento;
            const [faturadas, aFaturar, devolvidas] = await Promise.all([
                this.integradorNbs.getVendasFaturadas(codEmpresa, periodo),
                this.integradorNbs.getVendasAFaturar(codEmpresa, periodo),
                this.integradorNbs.getPropostasDevolvidas(codEmpresa, periodo),
            ]);
            const todasVendasNbs = [...faturadas, ...aFaturar, ...devolvidas];
            if (!todasVendasNbs.length) {
                return { response: [], enableAFaturarPremium };
            }
            const chassisList = todasVendasNbs
                .map(v => v.chassi)
                .filter(Boolean);
            const rvdExistentes = await this.rvdVendaService.findByStoreAndChassis(idLoja, chassisList);
            const rvdMap = new Map(rvdExistentes.map(r => [r.chassi, r]));
            const response = todasVendasNbs.map(venda => {
                const rvd = rvdMap.get(venda.chassi ?? '') ?? null;
                const maisInformacoes = {
                    dtaAberturaProposta: venda.dtaAberturaProposta ?? null,
                    modelo: venda.modelo ?? null,
                    status: venda.status,
                    nomeCliente: venda.nomeCliente ?? null,
                    nomeVendedor: venda.nomeVendedor ?? null,
                    idVendedor: venda.idVendedor ?? null,
                    diasEstoque: venda.diasEstoque ?? null,
                    diasAteFaturar: venda.diasAteFaturar ?? null,
                    nfNo: venda.nfNo ?? null,
                    valorNfFabrica: venda.valorNfFabrica ?? null,
                    valorNotaVenda: venda.valorNotaVenda ?? null,
                };
                return {
                    loja_idloja: idLoja,
                    departamento_iddepartamento: departamento,
                    chassi: venda.chassi,
                    nro_proposta: venda.proposta,
                    chave_proposta_loja_dms: venda.proposta
                        ? String(venda.proposta)
                        : venda.chassi,
                    id_usuario_dms: venda.idVendedor,
                    nome_usuario_dms: venda.nomeVendedor,
                    cpf_usuario_dms: venda.cpfVendedor,
                    departamento_usuario_dms: venda.departamentoVendedor,
                    time_venda_dms: venda.timeVenda,
                    nome_time_venda_dms: venda.desTimeVenda,
                    devolucao: venda.status === 'DEVOLVIDO',
                    status_a_faturar: rvd?.status_a_faturar ?? null,
                    veiculo_capturado: rvd?.veiculo_capturado ?? null,
                    valor_sinal: rvd?.valor_sinal ?? 0,
                    valor_compra: rvd?.valor_compra ?? venda.valorNotaVenda ?? null,
                    correcao_faturamento: rvd?.correcao_faturamento ?? 0,
                    bonus: rvd?.bonus ?? 0,
                    outros_bonus: rvd?.outros_bonus ?? 0,
                    acessorios: rvd?.acessorios ?? 0,
                    valor_financiado: rvd?.valor_financiado ?? 0,
                    acessorios_nf: rvd?.acessorios_nf ?? 0,
                    outros_nf: rvd?.outros_nf ?? 0,
                    brinde: rvd?.brinde ?? 0,
                    banco: rvd?.banco ?? null,
                    valor_consorcio: rvd?.valor_consorcio ?? 0,
                    consorcio: rvd?.consorcio ?? null,
                    tabela: rvd?.tabela ?? null,
                    despachante: rvd?.despachante ?? 0,
                    seguro: rvd?.seguro ?? 0,
                    bonus_complementar: rvd?.bonus_complementar ?? 0,
                    despesas_vendas: rvd?.despesas_vendas ?? 0,
                    plus_antecipado: rvd?.plus_antecipado ?? 0,
                    top: rvd?.top ?? 0,
                    historico: rvd?.historico ?? null,
                    a_faturar_premium: rvd?.a_faturar_premium ?? null,
                    maisInformacoes,
                };
            });
            return { response, enableAFaturarPremium };
        }
        catch (error) {
            this.logger.error('Erro em findVendasVeiculos:', error);
            throw error;
        }
    }
    async updateVendas(vendas) {
        return this.rvdVendaService.createOrUpdate(vendas);
    }
    async getVendedoresBI(integracao) {
        try {
            const codEmpresa = integracao.dePara_LinxDms;
            const departamento = integracao.departamento_iddepartamento;
            return await this.integradorNbs.getVendedores(codEmpresa, departamento);
        }
        catch (error) {
            this.logger.error('Erro em getVendedoresBI:', error);
            return [];
        }
    }
    async getBancos() {
        return [
            { nome: 'BANCO DO BRASIL' },
            { nome: 'BRADESCO' },
            { nome: 'ITAÚ' },
            { nome: 'SANTANDER' },
            { nome: 'CAIXA' },
            { nome: 'SAFRA' },
            { nome: 'VOTORANTIM' },
            { nome: 'PAN' },
        ];
    }
    async getConsorcios() {
        return [
            { id: 1, consorcio: 'PORTO SEGURO' },
            { id: 2, consorcio: 'EMBRACON' },
            { id: 3, consorcio: 'MAGAZINE LUIZA' },
            { id: 4, consorcio: 'BANCO DO BRASIL' },
            { id: 5, consorcio: 'BRADESCO' },
        ];
    }
};
exports.CadastroVendasService = CadastroVendasService;
exports.CadastroVendasService = CadastroVendasService = CadastroVendasService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [rvd_venda_service_1.RvdVendaService,
        integrador_dms_nbs_service_1.IntegradorDmsNbsService])
], CadastroVendasService);
//# sourceMappingURL=cadastro-vendas.service.js.map