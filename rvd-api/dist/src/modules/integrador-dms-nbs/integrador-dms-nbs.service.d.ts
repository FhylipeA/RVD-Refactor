import { DataSource } from 'typeorm';
import type { VendaNbs, VendedorNbs } from './integrador-dms-nbs.interface';
export declare class IntegradorDmsNbsService {
    private readonly dataSource;
    private readonly logger;
    private readonly sqlDir;
    constructor(dataSource: DataSource);
    getVendasFaturadas(codEmpresa: string, periodo: string): Promise<VendaNbs[]>;
    getVendasAFaturar(codEmpresa: string, periodo: string): Promise<VendaNbs[]>;
    getPropostasDevolvidas(codEmpresa: string, periodo: string): Promise<VendaNbs[]>;
    getVendedores(codEmpresa: string, departamento: string): Promise<VendedorNbs[]>;
}
