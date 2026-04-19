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
exports.RvdVendaController = void 0;
const common_1 = require("@nestjs/common");
const rvd_venda_service_1 = require("./rvd-venda.service");
const create_rvd_venda_dto_1 = require("./dto/create-rvd-venda.dto");
const update_rvd_venda_dto_1 = require("./dto/update-rvd-venda.dto");
const zod_validation_pipe_1 = require("../../shared/pipes/zod-validation.pipe");
let RvdVendaController = class RvdVendaController {
    rvdVendaService;
    constructor(rvdVendaService) {
        this.rvdVendaService = rvdVendaService;
    }
    createOrUpdate(vendas) {
        return this.rvdVendaService.createOrUpdate(vendas);
    }
    createManualInsert(venda) {
        return this.rvdVendaService.createManualInsert(venda);
    }
    updateManualInsert(dto) {
        return this.rvdVendaService.updateManualInsert(dto);
    }
    removeByStoreAndProposalKey(loja_idloja, chave_proposta) {
        return this.rvdVendaService.removeByStoreAndProposalKey(loja_idloja, chave_proposta);
    }
};
exports.RvdVendaController = RvdVendaController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(create_rvd_venda_dto_1.CreateRvdVendaSchema.array())),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], RvdVendaController.prototype, "createOrUpdate", null);
__decorate([
    (0, common_1.Post)('create-manual-insert'),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(create_rvd_venda_dto_1.CreateRvdVendaSchema)),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RvdVendaController.prototype, "createManualInsert", null);
__decorate([
    (0, common_1.Patch)('update-manual-insert'),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(update_rvd_venda_dto_1.UpdateManualInsertSchema)),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RvdVendaController.prototype, "updateManualInsert", null);
__decorate([
    (0, common_1.Delete)('loja/:loja_idloja/chave-proposta/:chave_proposta'),
    __param(0, (0, common_1.Param)('loja_idloja', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('chave_proposta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], RvdVendaController.prototype, "removeByStoreAndProposalKey", null);
exports.RvdVendaController = RvdVendaController = __decorate([
    (0, common_1.Controller)('rvd-venda'),
    __metadata("design:paramtypes", [rvd_venda_service_1.RvdVendaService])
], RvdVendaController);
//# sourceMappingURL=rvd-venda.controller.js.map