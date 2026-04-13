/*
  Warnings:

  - A unique constraint covering the columns `[loja_idloja,departamento_iddepartamento,nro_proposta,id_usuario_dms,devolucao]` on the table `rvd_venda` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `rvd_venda_loja_idloja_departamento_iddepartamento_nro_propos_key` ON `rvd_venda`(`loja_idloja`, `departamento_iddepartamento`, `nro_proposta`, `id_usuario_dms`, `devolucao`);
