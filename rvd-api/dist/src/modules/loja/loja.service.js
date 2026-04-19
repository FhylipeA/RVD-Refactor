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
exports.LojaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let LojaService = class LojaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    formatLoja(loja) {
        return {
            idloja: loja.id,
            nome: loja.nome,
            dePara_LinxDms: loja.dePara_LinxDms,
            bandeira_idbandeira: loja.bandeira_idbandeira,
            ativo: loja.ativo,
            rvdVendas: loja.departamentos.map((d) => ({
                id: d.id,
                departamento_iddepartamento: d.departamento_iddepartamento,
                descricao_departamento: d.descricao_departamento,
                legado: d.legado,
                loja_nome_bandeira: d.loja_nome_bandeira,
                ativo: d.ativo,
                loja_idloja: d.loja_id,
                dePara_LinxDms: loja.dePara_LinxDms,
            })),
        };
    }
    async findAll() {
        const lojas = await this.prisma.loja.findMany({
            where: { ativo: true },
            include: { departamentos: { where: { ativo: true } } },
            orderBy: { nome: 'asc' },
        });
        return lojas.map(this.formatLoja);
    }
    async findOne(id) {
        const loja = await this.prisma.loja.findUnique({
            where: { id },
            include: { departamentos: true },
        });
        if (!loja)
            throw new common_1.NotFoundException(`Loja ${id} não encontrada`);
        return this.formatLoja(loja);
    }
    async create(dto) {
        const loja = await this.prisma.loja.create({
            data: {
                nome: dto.nome,
                dePara_LinxDms: dto.dePara_LinxDms,
                bandeira_idbandeira: dto.bandeira_idbandeira,
                ativo: dto.ativo ?? true,
                departamentos: dto.departamentos
                    ? { create: dto.departamentos }
                    : undefined,
            },
            include: { departamentos: true },
        });
        return this.formatLoja(loja);
    }
    async update(id, dto) {
        await this.findOne(id);
        const loja = await this.prisma.loja.update({
            where: { id },
            data: dto,
            include: { departamentos: true },
        });
        return this.formatLoja(loja);
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.loja.update({
            where: { id },
            data: { ativo: false },
        });
    }
    async addDepartamento(lojaId, dto) {
        await this.findOne(lojaId);
        await this.prisma.rvdVendaConfig.create({
            data: { ...dto, loja_id: lojaId },
        });
        return this.findOne(lojaId);
    }
    async updateDepartamento(lojaId, depId, dto) {
        await this.prisma.rvdVendaConfig.update({
            where: { id: depId },
            data: dto,
        });
        return this.findOne(lojaId);
    }
    async removeDepartamento(lojaId, depId) {
        await this.prisma.rvdVendaConfig.update({
            where: { id: depId },
            data: { ativo: false },
        });
        return this.findOne(lojaId);
    }
};
exports.LojaService = LojaService;
exports.LojaService = LojaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LojaService);
//# sourceMappingURL=loja.service.js.map