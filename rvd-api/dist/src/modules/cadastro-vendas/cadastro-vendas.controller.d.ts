import { CadastroVendasService } from './cadastro-vendas.service';
import type { Integracao } from './cadastro-vendas.interface';
export declare class CadastroVendasController {
    private readonly cadastroVendasService;
    constructor(cadastroVendasService: CadastroVendasService);
    findVendas(idLoja: number, periodo: string, integracao: Integracao): Promise<{
        response: any[];
        enableAFaturarPremium: boolean;
    }>;
    updateVendas(vendas: any[]): Promise<any>;
    getVendedores(integracao: Integracao): Promise<any[]>;
    validaPremium(integracao: Integracao): boolean;
    getBancos(): Promise<{
        nome: string;
    }[]>;
    getConsorcios(): Promise<{
        id: number;
        consorcio: string;
    }[]>;
}
