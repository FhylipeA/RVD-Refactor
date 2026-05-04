import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRvdVendaDto } from './dto/create-rvd-venda.dto';
import { UpdateManualInsertDto } from './dto/update-rvd-venda.dto';
import { MaisInformacoes } from './rvd-venda.interface';

@Injectable()
export class RvdVendaService {
  constructor(private readonly prisma: PrismaService) { }

  private toJsonValue(value: unknown): any {
    if (value === null || value === undefined) return null;
    return value;
  }

  private prepareVendaData(venda: CreateRvdVendaDto) {
    return {
      ...venda,
      a_faturar_premium: this.toJsonValue(venda.a_faturar_premium),
      historico: this.toJsonValue(venda.historico),
    };
  }

  async createOrUpdate(vendas: CreateRvdVendaDto[]) {
    return this.prisma.$transaction(
      vendas.map((venda) => {
        const data = this.prepareVendaData(venda);
        return this.prisma.rvdVenda.upsert({
          where: {
            loja_idloja_departamento_iddepartamento_nro_proposta_id_usuario_dms_devolucao: {
              loja_idloja: venda.loja_idloja,
              departamento_iddepartamento: venda.departamento_iddepartamento,
              nro_proposta: venda.nro_proposta ?? 0,
              id_usuario_dms: venda.id_usuario_dms ?? 0,
              devolucao: venda.devolucao ?? false,
            },
          },
          update: data,
          create: data,
        });
      }),
    );
  }

  async createManualInsert(venda: CreateRvdVendaDto) {
    const existing = await this.prisma.rvdVenda.findFirst({
      where: {
        loja_idloja: venda.loja_idloja,
        departamento_iddepartamento: venda.departamento_iddepartamento,
        chave_proposta_loja_dms: venda.chave_proposta_loja_dms,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Chassi ${venda.chassi} já existe na base de dados, favor verificar.`,
      );
    }

    return this.prisma.rvdVenda.create({
      data: this.prepareVendaData(venda),
    });
  }

  async updateManualInsert(dto: UpdateManualInsertDto) {
    const { rvdVendaManual, rvdVendaManualUpdated } = dto;

    const existing = await this.prisma.rvdVenda.findFirst({
      where: {
        loja_idloja: rvdVendaManual.loja_idloja,
        departamento_iddepartamento: rvdVendaManual.departamento_iddepartamento,
        nro_proposta: rvdVendaManual.nro_proposta,
        chave_proposta_loja_dms: rvdVendaManual.chave_proposta_loja_dms,
        devolucao: rvdVendaManual.devolucao ?? false,
      },
    });

    if (!existing) {
      throw new NotFoundException('Registro não encontrado.');
    }

    return this.prisma.rvdVenda.update({
      where: { id: existing.id },
      data: this.prepareVendaData(rvdVendaManualUpdated),
    });
  }

  async findByStore(loja_idloja: number) {
    return this.prisma.rvdVenda.findMany({
      where: { loja_idloja },
      orderBy: { created_at: 'asc' },
    });
  }

  async findByFilters(
    loja_idloja: number,
    departamento_iddepartamento: string,
    nro_propostas: number[],
    aFaturarPremium: boolean,
  ) {
    const orConditions: any[] = [];

    if (nro_propostas.length > 0) {
      orConditions.push({ nro_proposta: { in: nro_propostas } });
    }

    if (aFaturarPremium) {
      orConditions.push({
        a_faturar_premium: { not: 'DbNull' as any },
        status_a_faturar: { notIn: ['REALIZADO', 'DEVOLVIDO'] },
      });
    }

    return this.prisma.rvdVenda.findMany({
      where: {
        loja_idloja,
        departamento_iddepartamento,
        devolucao: false,
        ...(orConditions.length > 0 && { OR: orConditions }),
      },
      orderBy: { created_at: 'asc' },
    });
  }

  async findReturned(loja_idloja: number, departamento_iddepartamento: string) {
    return this.prisma.rvdVenda.findMany({
      where: { loja_idloja, departamento_iddepartamento, devolucao: true },
      orderBy: { created_at: 'asc' },
    });
  }

  async findAFaturarPremium(
    loja_idloja: number,
    departamento_iddepartamento: string,
  ) {
    return this.prisma.rvdVenda.findMany({
      where: {
        loja_idloja,
        departamento_iddepartamento,
        devolucao: false,
        a_faturar_premium: { not: 'DbNull' as any },
        status_a_faturar: { notIn: ['REALIZADO', 'DEVOLVIDO'] },
      },
      orderBy: { created_at: 'asc' },
    });
  }

  async findManualByStorePeriodAndDepartment(
    loja_idloja: number,
    periodo: string,
    departamento_iddepartamento: string,
  ) {
    return this.prisma.rvdVenda.findMany({
      where: {
        loja_idloja,
        departamento_iddepartamento,
        devolucao: false,
        status_a_faturar: { not: 'REALIZADO' },
        a_faturar_premium: { not: 'DbNull' as any },
      },
      orderBy: { created_at: 'asc' },
    });
  }

  async removeByStoreAndProposalKey(
    loja_idloja: number,
    chave_proposta_loja_dms: string,
  ) {
    const existing = await this.prisma.rvdVenda.findFirst({
      where: { loja_idloja, chave_proposta_loja_dms, devolucao: false },
    });

    if (!existing) {
      throw new NotFoundException('Registro não encontrado.');
    }

    return this.prisma.rvdVenda.delete({ where: { id: existing.id } });
  }

  async removeByStoreAndProposals(loja_idloja: number, nro_propostas: number[]) {
    return this.prisma.rvdVenda.deleteMany({
      where: { loja_idloja, nro_proposta: { in: nro_propostas } },
    });
  }

  buildMaisInformacoes(proposta: any, buscaProposta: any): MaisInformacoes {
    if (buscaProposta) {
      return {
        dtaAberturaProposta: buscaProposta.dataVenda ?? null,
        modelo: buscaProposta.modelo ?? null,
        status: proposta.status_a_faturar === 'DEVOLVIDO' ? 'DEVOLVIDO' : buscaProposta.status,
        nomeCliente: buscaProposta.nomeCliente ?? null,
        nomeVendedor: buscaProposta.nomeVendedor ?? null,
        idVendedor: buscaProposta.idVendedor ?? null,
        diasEstoque: buscaProposta.diasEstoque ?? null,
        diasAteFaturar: buscaProposta.diasAteFaturar ?? null,
        nfNo: buscaProposta.nfNo ?? null,
        valorNfFabrica: buscaProposta.valorNfFabrica ?? null,
        valorNotaVenda: buscaProposta.valorNotaVenda ?? null,
      };
    }

    const premium = proposta.a_faturar_premium as any;

    return {
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
  }

  async findByStoreAndChassis(
    loja_idloja: number,
    chassisList: string[],
  ) {
    if (!chassisList.length) return [];
    return this.prisma.rvdVenda.findMany({
      where: {
        loja_idloja,
        chassi: { in: chassisList },
      },
      orderBy: { created_at: 'asc' },
    });
  }
}