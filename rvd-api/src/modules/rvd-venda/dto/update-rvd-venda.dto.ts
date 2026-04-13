import { z } from 'zod';
import { CreateRvdVendaSchema } from './create-rvd-venda.dto';

export const UpdateRvdVendaSchema = CreateRvdVendaSchema.partial();

export const UpdateManualInsertSchema = z.object({
  rvdVendaManual: z.object({
    loja_idloja: z.number().int().positive(),
    departamento_iddepartamento: z.string().max(2),
    nro_proposta: z.number().int(),
    chave_proposta_loja_dms: z.string().max(50),
    devolucao: z.boolean().optional(),
  }),
  rvdVendaManualUpdated: CreateRvdVendaSchema,
});

export type UpdateRvdVendaDto = z.infer<typeof UpdateRvdVendaSchema>;
export type UpdateManualInsertDto = z.infer<typeof UpdateManualInsertSchema>;