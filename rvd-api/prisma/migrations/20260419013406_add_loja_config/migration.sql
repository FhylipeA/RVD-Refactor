-- CreateTable
CREATE TABLE `loja` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `dePara_LinxDms` VARCHAR(20) NOT NULL,
    `bandeira_idbandeira` INTEGER NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rvd_venda_config` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `loja_id` INTEGER NOT NULL,
    `departamento_iddepartamento` VARCHAR(2) NOT NULL,
    `descricao_departamento` VARCHAR(100) NOT NULL,
    `legado` VARCHAR(20) NOT NULL,
    `loja_nome_bandeira` VARCHAR(50) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `rvd_venda_config` ADD CONSTRAINT `rvd_venda_config_loja_id_fkey` FOREIGN KEY (`loja_id`) REFERENCES `loja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
