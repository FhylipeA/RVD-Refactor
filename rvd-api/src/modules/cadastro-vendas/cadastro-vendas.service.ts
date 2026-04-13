import { Injectable, Logger } from '@nestjs/common';
import { RvdVendaService } from '../rvd-venda/rvd-venda.service';
import { RvdVenda } from '../rvd-venda/entities/rvd-venda.entity';
import { CreateRvdVendaDto } from '../rvd-venda/dto/create-rvd-venda.dto';
import { Integracao, MaisInformacoes } from './cadastro-vendas.interface';
import * as _ from 'lodash';

@Injectable()
export class CadastroVendasService {
  private readonly logger = new Logger(CadastroVendasService.name);

  constructor(
    private readonly rvdVendaService: RvdVendaService,
  ) {}

  validaAFaturarPremium(integracao: Integracao): boolean {
    return (
      integracao.legado === 'NBS' ||
      integracao.loja_nome_bandeira === 'AUDI' ||
      (integracao.loja_nome_bandeira === 'TOYOTA' &&
        integracao.departamento_iddepartamento === 'S') ||
      (integracao.loja_nome_bandeira === 'LEXUS' &&
        integracao.departamento_iddepartamento === 'S') ||
      (integracao.loja_nome_bandeira === 'HYUNDAI' &&
        integracao.departamento_iddepartamento === 'S')
    );
  }

  async findVendasVeiculos(
    idLoja: number,
    periodo: string,
    integracao: Integracao,
  ): Promise<{ response: any[]; enableAFaturarPremium: boolean }> {
    try {
      const enableAFaturarPremium = this.validaAFaturarPremium(integracao);
      const departamento = integracao.departamento_iddepartamento;

      const getRvdVendaByStore = await this.rvdVendaService.findByStore(idLoja);
      const searchPropostasDevolvidas = await this.rvdVendaService.findReturned(
        idLoja,
        departamento,
      );

      let searchVeiculosRvdVenda = await this.rvdVendaService.findByFilters(
        idLoja,
        departamento,
        getRvdVendaByStore.map(v => v.nro_proposta).filter(Boolean) as number[],
        enableAFaturarPremium,
      );

      if (enableAFaturarPremium) {
        const manuais = await this.rvdVendaService.findManualByStorePeriodAndDepartment(
          idLoja,
          periodo,
          departamento,
        );

        const todos = [...searchVeiculosRvdVenda, ...manuais];
        const unicos = Array.from(
          new Map(todos.map(v => [v.id, v])).values()
        );
        searchVeiculosRvdVenda = unicos;
      }

      const resultado = searchVeiculosRvdVenda.map(proposta => {
        const premium = proposta.a_faturar_premium as any;
        const maisInformacoes: MaisInformacoes = {
          dtaAberturaProposta: null,
          modelo: premium?.modelo ?? null,
          status:
            proposta.status_a_faturar === 'REALIZADO'
              ? 'FATURADO'
              : proposta.status_a_faturar === 'DEVOLVIDO'
              ? 'DEVOLVIDO'
              : 'A_FATURAR',
          nomeCliente: premium?.cliente ?? null,
          nomeVendedor: proposta.nome_usuario_dms ?? null,
          idVendedor: proposta.id_usuario_dms ?? null,
          diasEstoque: null,
          diasAteFaturar: null,
          nfNo: null,
          valorNfFabrica: premium?.valor_nf_fabrica ?? null,
          valorNotaVenda: premium?.valor_nota_venda ?? null,
        };

        return { ...proposta, maisInformacoes };
      });

      return { response: resultado, enableAFaturarPremium };
    } catch (error) {
      this.logger.error('Erro em findVendasVeiculos:', error);
      throw error;
    }
  }

  async updateVendas(vendas: any[]): Promise<any> {
    return this.rvdVendaService.createOrUpdate(vendas as CreateRvdVendaDto[]);
  }

  async getVendedoresBI(integracao: Integracao): Promise<any[]> {
    // Retorna lista vazia por enquanto
    // Quando integrar com DMS Linx/NBS, implementar aqui
    return [];
  }

  async getBancos(): Promise<{ nome: string }[]> {
    return [
      { nome: 'BANCO DO BRASIL' },
      { nome: 'BRADESCO' },
      { nome: 'ITAÚ' },
      { nome: 'SANTANDER' },
      { nome: 'CAIXA' },
      { nome: 'SAFRA' },
      { nome: 'VOTORANTIM' },
      { nome: 'PAN' },
    ];
  }

  async getConsorcios(): Promise<{ id: number; consorcio: string }[]> {
    return [
      { id: 1, consorcio: 'PORTO SEGURO' },
      { id: 2, consorcio: 'EMBRACON' },
      { id: 3, consorcio: 'MAGAZINE LUIZA' },
      { id: 4, consorcio: 'BANCO DO BRASIL' },
      { id: 5, consorcio: 'BRADESCO' },
    ];
  }
}