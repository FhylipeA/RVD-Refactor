import { RvdVendaService } from '../rvd-venda/rvd-venda.service';
import { IntegradorDmsNbsService } from '../integrador-dms-nbs/integrador-dms-nbs.service';
import type { Integracao } from './cadastro-vendas.interface';
export declare class CadastroVendasService {
    private readonly rvdVendaService;
    private readonly integradorNbs;
    private readonly logger;
    constructor(rvdVendaService: RvdVendaService, integradorNbs: IntegradorDmsNbsService);
    validaAFaturarPremium(integracao: Integracao): boolean;
    findVendasVeiculos(idLoja: number, periodo: string, integracao: Integracao): Promise<{
        response: any[];
        enableAFaturarPremium: boolean;
    }>;
    updateVendas(vendas: any[]): Promise<any>;
    getVendedoresBI(integracao: Integracao): Promise<any[]>;
    getBancos(): Promise<{
        nome: string;
    }[]>;
    getConsorcios(): Promise<{
        id: number;
        consorcio: string;
    }[]>;
}
