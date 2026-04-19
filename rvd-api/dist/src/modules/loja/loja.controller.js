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
exports.LojaController = void 0;
const common_1 = require("@nestjs/common");
const loja_service_1 = require("./loja.service");
let LojaController = class LojaController {
    lojaService;
    constructor(lojaService) {
        this.lojaService = lojaService;
    }
    findAll() {
        return this.lojaService.findAll();
    }
    findOne(id) {
        return this.lojaService.findOne(id);
    }
    create(dto) {
        return this.lojaService.create(dto);
    }
    update(id, dto) {
        return this.lojaService.update(id, dto);
    }
    remove(id) {
        return this.lojaService.remove(id);
    }
    addDepartamento(id, dto) {
        return this.lojaService.addDepartamento(id, dto);
    }
    updateDepartamento(id, depId, dto) {
        return this.lojaService.updateDepartamento(id, depId, dto);
    }
    removeDepartamento(id, depId) {
        return this.lojaService.removeDepartamento(id, depId);
    }
};
exports.LojaController = LojaController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LojaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LojaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LojaController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], LojaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LojaController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/departamentos'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], LojaController.prototype, "addDepartamento", null);
__decorate([
    (0, common_1.Patch)(':id/departamentos/:depId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('depId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", void 0)
], LojaController.prototype, "updateDepartamento", null);
__decorate([
    (0, common_1.Delete)(':id/departamentos/:depId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('depId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], LojaController.prototype, "removeDepartamento", null);
exports.LojaController = LojaController = __decorate([
    (0, common_1.Controller)('lojas'),
    __metadata("design:paramtypes", [loja_service_1.LojaService])
], LojaController);
//# sourceMappingURL=loja.controller.js.map