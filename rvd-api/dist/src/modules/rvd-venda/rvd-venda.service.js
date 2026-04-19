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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RvdVendaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let RvdVendaService = class RvdVendaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    toJsonValue(value) {
        if (value === null || value === undefined)
            return client_1.Prisma.JsonNull;
        return value;
    }
    prepareVendaData(venda) {
        return {
            ...venda,
            a_faturar_premium: this.toJsonValue(venda.a_faturar_premium),
            historico: this.toJsonValue(venda.historico),
        };
    }
    async createOrUpdate(vendas) {
        return this.prisma.$transaction(vendas.map((venda) => {
            const data = this.prepareVendaData(venda);
            return this.prisma.rvdVenda.upsert({
                where: {
                    loja_idloja_departamento_iddepartamento_nro_proposta_id_usuario_dms_devolucao: {
                        loja_idloja: venda.loja_idloja,
                        departamento_iddepartamento: venda.departamento_iddepartamento,
                        nro_proposta: venda.nro_proposta ?? 0,
                        id_usuario_dms: venda.id_usuario_dms ?? 0,
                        devolucao: venda.devolucao ?? false,
                    },
                },
                update: data,
                create: data,
            });
        }));
    }
    async createManualInsert(venda) {
        const existing = await this.prisma.rvdVenda.findFirst({
            where: {
                loja_idloja: venda.loja_idloja,
                departamento_iddepartamento: venda.departamento_iddepartamento,
                chave_proposta_loja_dms: venda.chave_proposta_loja_dms,
            },
        });
        if (existing) {
            throw new common_1.ConflictException(`Chassi ${venda.chassi} já existe na base de dados, favor verificar.`);
        }
        return this.prisma.rvdVenda.create({
            data: this.prepareVendaData(venda),
        });
    }
    async updateManualInsert(dto) {
        const { rvdVendaManual, rvdVendaManualUpdated } = dto;
        const existing = await this.prisma.rvdVenda.findFirst({
            where: {
                loja_idloja: rvdVendaManual.loja_idloja,
                departamento_iddepartamento: rvdVendaManual.departamento_iddepartamento,
                nro_proposta: rvdVendaManual.nro_proposta,
                chave_proposta_loja_dms: rvdVendaManual.chave_proposta_loja_dms,
                devolucao: rvdVendaManual.devolucao ?? false,
            },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Registro não encontrado.');
        }
        return this.prisma.rvdVenda.update({
            where: { id: existing.id },
            data: this.prepareVendaData(rvdVendaManualUpdated),
        });
    }
    async findByStore(loja_idloja) {
        return this.prisma.rvdVenda.findMany({
            where: { loja_idloja },
            orderBy: { created_at: 'asc' },
        });
    }
    async findByFilters(loja_idloja, departamento_iddepartamento, nro_propostas, aFaturarPremium) {
        const orConditions = [];
        if (nro_propostas.length > 0) {
            orConditions.push({ nro_proposta: { in: nro_propostas } });
        }
        if (aFaturarPremium) {
            orConditions.push({
                a_faturar_premium: { not: client_1.Prisma.JsonNull },
                status_a_faturar: { notIn: ['REALIZADO', 'DEVOLVIDO'] },
            });
        }
        return this.prisma.rvdVenda.findMany({
            where: {
                loja_idloja,
                departamento_iddepartamento,
                devolucao: false,
                ...(orConditions.length > 0 && { OR: orConditions }),
            },
            orderBy: { created_at: 'asc' },
        });
    }
    async findReturned(loja_idloja, departamento_iddepartamento) {
        return this.prisma.rvdVenda.findMany({
            where: { loja_idloja, departamento_iddepartamento, devolucao: true },
            orderBy: { created_at: 'asc' },
        });
    }
    async findAFaturarPremium(loja_idloja, departamento_iddepartamento) {
        return this.prisma.rvdVenda.findMany({
            where: {
                loja_idloja,
                departamento_iddepartamento,
                devolucao: false,
                a_faturar_premium: { not: client_1.Prisma.JsonNull },
                status_a_faturar: { notIn: ['REALIZADO', 'DEVOLVIDO'] },
            },
            orderBy: { created_at: 'asc' },
        });
    }
    async findManualByStorePeriodAndDepartment(loja_idloja, periodo, departamento_iddepartamento) {
        return this.prisma.rvdVenda.findMany({
            where: {
                loja_idloja,
                departamento_iddepartamento,
                devolucao: false,
                status_a_faturar: { not: 'REALIZADO' },
                a_faturar_premium: { not: client_1.Prisma.JsonNull },
            },
            orderBy: { created_at: 'asc' },
        });
    }
    async removeByStoreAndProposalKey(loja_idloja, chave_proposta_loja_dms) {
        const existing = await this.prisma.rvdVenda.findFirst({
            where: { loja_idloja, chave_proposta_loja_dms, devolucao: false },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Registro não encontrado.');
        }
        return this.prisma.rvdVenda.delete({ where: { id: existing.id } });
    }
    async removeByStoreAndProposals(loja_idloja, nro_propostas) {
        return this.prisma.rvdVenda.deleteMany({
            where: { loja_idloja, nro_proposta: { in: nro_propostas } },
        });
    }
    buildMaisInformacoes(proposta, buscaProposta) {
        if (buscaProposta) {
            return {
                dtaAberturaProposta: buscaProposta.dataVenda ?? null,
                modelo: buscaProposta.modelo ?? null,
                status: proposta.status_a_faturar === 'DEVOLVIDO' ? 'DEVOLVIDO' : buscaProposta.status,
                nomeCliente: buscaProposta.nomeCliente ?? null,
                nomeVendedor: buscaProposta.nomeVendedor ?? null,
                idVendedor: buscaProposta.idVendedor ?? null,
                diasEstoque: buscaProposta.diasEstoque ?? null,
                diasAteFaturar: buscaProposta.diasAteFaturar ?? null,
                nfNo: buscaProposta.nfNo ?? null,
                valorNfFabrica: buscaProposta.valorNfFabrica ?? null,
                valorNotaVenda: buscaProposta.valorNotaVenda ?? null,
            };
        }
        const premium = proposta.a_faturar_premium;
        return {
            dtaAberturaProposta: null,
            modelo: premium?.modelo ?? null,
            status: proposta.status_a_faturar === 'REALIZADO'
                ? 'FATURADO'
                : proposta.status_a_faturar === 'DEVOLVIDO'
                    ? 'DEVOLVIDO'
                    : 'A_FATURAR',
            nomeCliente: premium?.cliente ?? null,
            nomeVendedor: proposta.nome_usuario_dms ?? null,
            idVendedor: proposta.id_usuario_dms ?? null,
            diasEstoque: null,
            diasAteFaturar: null,
            nfNo: null,
            valorNfFabrica: premium?.valor_nf_fabrica ?? null,
            valorNotaVenda: premium?.valor_nota_venda ?? null,
        };
    }
    async findByStoreAndChassis(loja_idloja, chassisList) {
        if (!chassisList.length)
            return [];
        return this.prisma.rvdVenda.findMany({
            where: {
                loja_idloja,
                chassi: { in: chassisList },
            },
            orderBy: { created_at: 'asc' },
        });
    }
};
exports.RvdVendaService = RvdVendaService;
exports.RvdVendaService = RvdVendaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RvdVendaService);
//# sourceMappingURL=rvd-venda.service.js.map