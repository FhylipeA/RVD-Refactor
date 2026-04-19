"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RvdVendaModule = void 0;
const common_1 = require("@nestjs/common");
const rvd_venda_service_1 = require("./rvd-venda.service");
const rvd_venda_controller_1 = require("./rvd-venda.controller");
let RvdVendaModule = class RvdVendaModule {
};
exports.RvdVendaModule = RvdVendaModule;
exports.RvdVendaModule = RvdVendaModule = __decorate([
    (0, common_1.Module)({
        controllers: [rvd_venda_controller_1.RvdVendaController],
        providers: [rvd_venda_service_1.RvdVendaService],
        exports: [rvd_venda_service_1.RvdVendaService],
    })
], RvdVendaModule);
//# sourceMappingURL=rvd-venda.module.js.map