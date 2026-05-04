import { Injectable, Logger } from '@nestjs/common';
import { RvdVendaService } from '../rvd-venda/rvd-venda.service';
import { IntegradorDmsNbsService } from '../integrador-dms-nbs/integrador-dms-nbs.service';
import type { CreateRvdVendaDto } from '../rvd-venda/dto/create-rvd-venda.dto';
import type { Integracao } from './cadastro-vendas.interface';

@Injectable()
export class CadastroVendasService {
  private readonly logger = new Logger(CadastroVendasService.name);

  constructor(
    private readonly rvdVendaService: RvdVendaService,
    private readonly integradorNbs: IntegradorDmsNbsService,
  ) { }

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

  private mapearStatus(statusOracle: string): string {
    const mapa: Record<string, string> = {
      'FATURADO': 'REALIZADO',
      'A_FATURAR': 'PENDENTE',
      'DEVOLVIDO': 'DEVOLVIDO',
    };
    return mapa[statusOracle] ?? null;
  }

  async findVendasVeiculos(
    idLoja: number,
    periodo: string,
    integracao: Integracao,
  ): Promise<{ response: any[]; enableAFaturarPremium: boolean }> {
    try {
      const enableAFaturarPremium = this.validaAFaturarPremium(integracao);
      const codEmpresa = integracao.dePara_LinxDms;
      const departamento = integracao.departamento_iddepartamento;

      // Busca paralela no Oracle NBS
      const [faturadas, aFaturar, devolvidas] = await Promise.all([
        this.integradorNbs.getVendasFaturadas(codEmpresa, periodo, departamento),
        this.integradorNbs.getVendasAFaturar(codEmpresa, periodo, departamento),
        this.integradorNbs.getPropostasDevolvidas(codEmpresa, periodo),
      ]);

      this.logger.log(`Faturadas: ${faturadas.length}`);
      this.logger.log(`A faturar: ${aFaturar.length}`);
      this.logger.log(`Devolvidas: ${devolvidas.length}`);
      this.logger.log(`Primeira faturada: ${JSON.stringify(faturadas[0])}`);

      const todasVendasNbs = [...faturadas, ...aFaturar, ...devolvidas];

      if (!todasVendasNbs.length) {
        return { response: [], enableAFaturarPremium };
      }

      // Busca registros RVD existentes no banco local
      const chassisList = todasVendasNbs
        .map(v => v.chassi)
        .filter(Boolean) as string[];

      const rvdExistentes = await this.rvdVendaService.findByStoreAndChassis(
        idLoja,
        chassisList,
      );

      // Monta mapa de RVD por chassi para merge rápido
      const rvdMap = new Map<string, any>(
        rvdExistentes.map((r: any) => [r.chassi, r]),
      );

      // Merge: dados do DMS + dados editáveis do RVD
      const response = todasVendasNbs.map(venda => {
        const rvd = rvdMap.get(venda.chassi ?? '') ?? null;

        const maisInformacoes = {
          dtaAberturaProposta: venda.dtaAberturaProposta ?? null,
          modelo: venda.modelo ?? null,
          status: venda.status,
          nomeCliente: venda.nomeCliente ?? null,
          nomeVendedor: venda.nomeVendedor ?? null,
          idVendedor: venda.idVendedor ?? null,
          diasEstoque: venda.diasEstoque ?? null,
          diasAteFaturar: venda.diasAteFaturar ?? null,
          nfNo: venda.nfNo ?? null,
          valorNfFabrica: venda.valorNfFabrica ?? null,
          valorNotaVenda: venda.valorNotaVenda ?? null,
        };

        return {
          // Dados base do DMS
          loja_idloja: idLoja,
          departamento_iddepartamento: departamento,
          chassi: venda.chassi,
          nro_proposta: venda.proposta,
          chave_proposta_loja_dms: venda.proposta
            ? String(venda.proposta)
            : venda.chassi,
          id_usuario_dms: venda.idVendedor,
          nome_usuario_dms: venda.nomeVendedor,
          cpf_usuario_dms: venda.cpfVendedor,
          departamento_usuario_dms: venda.departamentoVendedor,
          time_venda_dms: venda.timeVenda,
          nome_time_venda_dms: venda.desTimeVenda,
          devolucao: venda.status === 'DEVOLVIDO',

          // Dados editáveis do RVD (se existirem)
          status_a_faturar: rvd?.status_a_faturar ?? this.mapearStatus(venda.status) ?? null,
          veiculo_capturado: rvd?.veiculo_capturado ?? null,
          valor_sinal: rvd?.valor_sinal ?? 0,
          valor_compra: rvd?.valor_compra ?? venda.valorNotaVenda ?? null,
          correcao_faturamento: rvd?.correcao_faturamento ?? 0,
          bonus: rvd?.bonus ?? 0,
          outros_bonus: rvd?.outros_bonus ?? 0,
          acessorios: rvd?.acessorios ?? 0,
          valor_financiado: rvd?.valor_financiado ?? 0,
          acessorios_nf: rvd?.acessorios_nf ?? 0,
          outros_nf: rvd?.outros_nf ?? 0,
          brinde: rvd?.brinde ?? 0,
          banco: rvd?.banco ?? null,
          valor_consorcio: rvd?.valor_consorcio ?? 0,
          consorcio: rvd?.consorcio ?? null,
          tabela: rvd?.tabela ?? null,
          despachante: rvd?.despachante ?? 0,
          seguro: rvd?.seguro ?? 0,
          bonus_complementar: rvd?.bonus_complementar ?? 0,
          despesas_vendas: rvd?.despesas_vendas ?? 0,
          plus_antecipado: rvd?.plus_antecipado ?? 0,
          top: rvd?.top ?? 0,
          historico: rvd?.historico ?? null,
          a_faturar_premium: rvd?.a_faturar_premium ?? null,

          // Dados do DMS para exibição
          maisInformacoes,
        };
      });

      return { response, enableAFaturarPremium };
    } catch (error) {
      this.logger.error('Erro em findVendasVeiculos:', error);
      throw error;
    }
  }

  async updateVendas(vendas: any[]): Promise<any> {
    return this.rvdVendaService.createOrUpdate(vendas as CreateRvdVendaDto[]);
  }

  async getVendedoresBI(integracao: Integracao): Promise<any[]> {
    try {
      const codEmpresa = integracao.dePara_LinxDms;
      const departamento = integracao.departamento_iddepartamento;
      return await this.integradorNbs.getVendedores(codEmpresa, departamento);
    } catch (error) {
      this.logger.error('Erro em getVendedoresBI:', error);
      return [];
    }
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