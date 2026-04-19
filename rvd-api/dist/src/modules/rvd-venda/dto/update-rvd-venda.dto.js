"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateManualInsertSchema = exports.UpdateRvdVendaSchema = void 0;
const zod_1 = require("zod");
const create_rvd_venda_dto_1 = require("./create-rvd-venda.dto");
exports.UpdateRvdVendaSchema = create_rvd_venda_dto_1.CreateRvdVendaSchema.partial();
exports.UpdateManualInsertSchema = zod_1.z.object({
    rvdVendaManual: zod_1.z.object({
        loja_idloja: zod_1.z.number().int().positive(),
        departamento_iddepartamento: zod_1.z.string().max(2),
        nro_proposta: zod_1.z.number().int(),
        chave_proposta_loja_dms: zod_1.z.string().max(50),
        devolucao: zod_1.z.boolean().optional(),
    }),
    rvdVendaManualUpdated: create_rvd_venda_dto_1.CreateRvdVendaSchema,
});
//# sourceMappingURL=update-rvd-venda.dto.js.map