import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { geraQuery, transformaElementosArrayParaCamelCase } from '../../shared/utils';
import type { VendaNbs, VendedorNbs } from './integrador-dms-nbs.interface';

@Injectable()
export class IntegradorDmsNbsService {
  private readonly logger = new Logger(IntegradorDmsNbsService.name);
  private readonly sqlDir = 'src/modules/integrador-dms-nbs/sql';

  constructor(
    @InjectDataSource('nbs-dms')
    private readonly dataSource: DataSource,
  ) { }

  async getVendasFaturadas(
    codEmpresa: string,
    periodo: string,
    departamento: string,
  ): Promise<VendaNbs[]> {
    try {
      const [ano, mes] = periodo.split('-');
      const filterString = `
      AND A.COD_EMPRESA = ${codEmpresa}
      AND EXTRACT(YEAR FROM A.EMISSAO) = ${ano}
      AND EXTRACT(MONTH FROM A.EMISSAO) = ${mes}
    `;

      const arquivo = departamento === 'N'
        ? 'rvd-vendas-faturados'
        : 'rvd-usados-vendas-faturados';

      const instruction = geraQuery(
        this.sqlDir,
        arquivo,
        [['filterString', filterString]],
      );

      const result = await this.dataSource.query(instruction);
      return transformaElementosArrayParaCamelCase(result) as VendaNbs[];
    } catch (error) {
      this.logger.error('Erro em getVendasFaturadas:', error);
      throw error;
    }
  }

  async getVendasAFaturar(
    codEmpresa: string,
    periodo: string,
    departamento: string,
  ): Promise<VendaNbs[]> {
    try {
      const [ano, mes] = periodo.split('-');
      const filterString = `
      AND A.COD_EMPRESA = ${codEmpresa}
      AND EXTRACT(YEAR FROM A.EMISSAO) = ${ano}
      AND EXTRACT(MONTH FROM A.EMISSAO) = ${mes}
    `;

      const arquivo = departamento === 'N'
        ? 'rvd-vendas-a-faturar'
        : 'rvd-usados-vendas-a-faturar';

      const instruction = geraQuery(
        this.sqlDir,
        arquivo,
        [['filterString', filterString]],
      );

      const result = await this.dataSource.query(instruction);
      return transformaElementosArrayParaCamelCase(result) as VendaNbs[];
    } catch (error) {
      this.logger.error('Erro em getVendasAFaturar:', error);
      throw error;
    }
  }

  async getPropostasDevolvidas(
    codEmpresa: string,
    periodo: string,
  ): Promise<VendaNbs[]> {
    try {
      const [ano, mes] = periodo.split('-');
      const filterString = `
        AND A.COD_EMPRESA = ${codEmpresa}
        AND EXTRACT(YEAR FROM A.EMISSAO) = ${ano}
        AND EXTRACT(MONTH FROM A.EMISSAO) = ${mes}
      `;

      const instruction = geraQuery(
        this.sqlDir,
        'rvd-propostas-devolvidas',
        [['filterString', filterString]],
      );

      const result = await this.dataSource.query(instruction);
      return transformaElementosArrayParaCamelCase(result) as VendaNbs[];
    } catch (error) {
      this.logger.error('Erro em getPropostasDevolvidas:', error);
      throw error;
    }
  }

  async getVendedores(
    codEmpresa: string,
    departamento: string,
  ): Promise<VendedorNbs[]> {
    try {
      const filterString = `
        AND EU.COD_EMPRESA = ${codEmpresa}
        AND EU.COD_EMPRESA_DEPARTAMENTO = '${departamento}'
      `;

      const instruction = geraQuery(
        this.sqlDir,
        'rvd-vendedores',
        [['filterString', filterString]],
      );

      const result = await this.dataSource.query(instruction);
      return transformaElementosArrayParaCamelCase(result) as VendedorNbs[];
    } catch (error) {
      this.logger.error('Erro em getVendedores:', error);
      throw error;
    }
  }
}