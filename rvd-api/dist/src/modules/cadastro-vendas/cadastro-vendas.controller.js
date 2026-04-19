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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CadastroVendasController = void 0;
const common_1 = require("@nestjs/common");
const cadastro_vendas_service_1 = require("./cadastro-vendas.service");
let CadastroVendasController = class CadastroVendasController {
    cadastroVendasService;
    constructor(cadastroVendasService) {
        this.cadastroVendasService = cadastroVendasService;
    }
    findVendas(idLoja, periodo, integracao) {
        return this.cadastroVendasService.findVendasVeiculos(idLoja, periodo, integracao);
    }
    updateVendas(vendas) {
        return this.cadastroVendasService.updateVendas(vendas);
    }
    getVendedores(integracao) {
        return this.cadastroVendasService.getVendedoresBI(integracao);
    }
    validaPremium(integracao) {
        return this.cadastroVendasService.validaAFaturarPremium(integracao);
    }
    getBancos() {
        return this.cadastroVendasService.getBancos();
    }
    getConsorcios() {
        return this.cadastroVendasService.getConsorcios();
    }
};
exports.CadastroVendasController = CadastroVendasController;
__decorate([
    (0, common_1.Post)('find-vendas'),
    __param(0, (0, common_1.Body)('idLoja')),
    __param(1, (0, common_1.Body)('periodo')),
    __param(2, (0, common_1.Body)('integracao')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", void 0)
], CadastroVendasController.prototype, "findVendas", null);
__decorate([
    (0, common_1.Post)('update-vendas'),
    __param(0, (0, common_1.Body)('vendas')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], CadastroVendasController.prototype, "updateVendas", null);
__decorate([
    (0, common_1.Post)('get-vendedores'),
    __param(0, (0, common_1.Body)('integracao')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CadastroVendasController.prototype, "getVendedores", null);
__decorate([
    (0, common_1.Post)('valida-premium'),
    __param(0, (0, common_1.Body)('integracao')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CadastroVendasController.prototype, "validaPremium", null);
__decorate([
    (0, common_1.Get)('bancos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CadastroVendasController.prototype, "getBancos", null);
__decorate([
    (0, common_1.Get)('consorcios'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CadastroVendasController.prototype, "getConsorcios", null);
exports.CadastroVendasController = CadastroVendasController = __decorate([
    (0, common_1.Controller)('rvd-venda'),
    __metadata("design:paramtypes", [cadastro_vendas_service_1.CadastroVendasService])
], CadastroVendasController);
//# sourceMappingURL=cadastro-vendas.controller.js.map