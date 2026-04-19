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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var IntegradorDmsNbsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegradorDmsNbsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const utils_1 = require("../../shared/utils");
let IntegradorDmsNbsService = IntegradorDmsNbsService_1 = class IntegradorDmsNbsService {
    dataSource;
    logger = new common_1.Logger(IntegradorDmsNbsService_1.name);
    sqlDir = 'src/modules/integrador-dms-nbs/sql';
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async getVendasFaturadas(codEmpresa, periodo) {
        try {
            const [ano, mes] = periodo.split('-');
            const filterString = `
        AND A.COD_EMPRESA = ${codEmpresa}
        AND EXTRACT(YEAR FROM A.EMISSAO) = ${ano}
        AND EXTRACT(MONTH FROM A.EMISSAO) = ${mes}
      `;
            const instruction = (0, utils_1.geraQuery)(this.sqlDir, 'rvd-vendas-faturados', [['filterString', filterString]]);
            const result = await this.dataSource.query(instruction);
            return (0, utils_1.transformaElementosArrayParaCamelCase)(result);
        }
        catch (error) {
            this.logger.error('Erro em getVendasFaturadas:', error);
            throw error;
        }
    }
    async getVendasAFaturar(codEmpresa, periodo) {
        try {
            const [ano, mes] = periodo.split('-');
            const filterString = `
        AND A.COD_EMPRESA = ${codEmpresa}
        AND EXTRACT(YEAR FROM A.EMISSAO) = ${ano}
        AND EXTRACT(MONTH FROM A.EMISSAO) = ${mes}
      `;
            const instruction = (0, utils_1.geraQuery)(this.sqlDir, 'rvd-vendas-a-faturar', [['filterString', filterString]]);
            const result = await this.dataSource.query(instruction);
            return (0, utils_1.transformaElementosArrayParaCamelCase)(result);
        }
        catch (error) {
            this.logger.error('Erro em getVendasAFaturar:', error);
            throw error;
        }
    }
    async getPropostasDevolvidas(codEmpresa, periodo) {
        try {
            const [ano, mes] = periodo.split('-');
            const filterString = `
        AND A.COD_EMPRESA = ${codEmpresa}
        AND EXTRACT(YEAR FROM A.EMISSAO) = ${ano}
        AND EXTRACT(MONTH FROM A.EMISSAO) = ${mes}
      `;
            const instruction = (0, utils_1.geraQuery)(this.sqlDir, 'rvd-propostas-devolvidas', [['filterString', filterString]]);
            const result = await this.dataSource.query(instruction);
            return (0, utils_1.transformaElementosArrayParaCamelCase)(result);
        }
        catch (error) {
            this.logger.error('Erro em getPropostasDevolvidas:', error);
            throw error;
        }
    }
    async getVendedores(codEmpresa, departamento) {
        try {
            const filterString = `
        AND EU.COD_EMPRESA = ${codEmpresa}
        AND EU.COD_EMPRESA_DEPARTAMENTO = '${departamento}'
      `;
            const instruction = (0, utils_1.geraQuery)(this.sqlDir, 'rvd-vendedores', [['filterString', filterString]]);
            const result = await this.dataSource.query(instruction);
            return (0, utils_1.transformaElementosArrayParaCamelCase)(result);
        }
        catch (error) {
            this.logger.error('Erro em getVendedores:', error);
            throw error;
        }
    }
};
exports.IntegradorDmsNbsService = IntegradorDmsNbsService;
exports.IntegradorDmsNbsService = IntegradorDmsNbsService = IntegradorDmsNbsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectDataSource)('nbs-dms')),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], IntegradorDmsNbsService);
//# sourceMappingURL=integrador-dms-nbs.service.js.map