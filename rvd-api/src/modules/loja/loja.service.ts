import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  CreateLojaDto,
  UpdateLojaDto,
  CreateRvdVendaConfigDto,
  UpdateRvdVendaConfigDto,
  LojaResponse,
} from './loja.interface';

@Injectable()
export class LojaService {
  constructor(private readonly prisma: PrismaService) {}

  private formatLoja(loja: any): LojaResponse {
    return {
      idloja: loja.id,
      nome: loja.nome,
      dePara_LinxDms: loja.dePara_LinxDms,
      bandeira_idbandeira: loja.bandeira_idbandeira,
      ativo: loja.ativo,
      rvdVendas: loja.departamentos.map((d: any) => ({
        id: d.id,
        departamento_iddepartamento: d.departamento_iddepartamento,
        descricao_departamento: d.descricao_departamento,
        legado: d.legado,
        loja_nome_bandeira: d.loja_nome_bandeira,
        ativo: d.ativo,
        loja_idloja: d.loja_id,
        dePara_LinxDms: loja.dePara_LinxDms,
      })),
    };
  }

  async findAll(): Promise<LojaResponse[]> {
    const lojas = await this.prisma.loja.findMany({
      where: { ativo: true },
      include: { departamentos: { where: { ativo: true } } },
      orderBy: { nome: 'asc' },
    });
    return lojas.map(this.formatLoja);
  }

  async findOne(id: number): Promise<LojaResponse> {
    const loja = await this.prisma.loja.findUnique({
      where: { id },
      include: { departamentos: true },
    });
    if (!loja) throw new NotFoundException(`Loja ${id} não encontrada`);
    return this.formatLoja(loja);
  }

  async create(dto: CreateLojaDto): Promise<LojaResponse> {
    const loja = await this.prisma.loja.create({
      data: {
        nome: dto.nome,
        dePara_LinxDms: dto.dePara_LinxDms,
        bandeira_idbandeira: dto.bandeira_idbandeira,
        ativo: dto.ativo ?? true,
        departamentos: dto.departamentos
          ? { create: dto.departamentos }
          : undefined,
      },
      include: { departamentos: true },
    });
    return this.formatLoja(loja);
  }

  async update(id: number, dto: UpdateLojaDto): Promise<LojaResponse> {
    await this.findOne(id);
    const loja = await this.prisma.loja.update({
      where: { id },
      data: dto,
      include: { departamentos: true },
    });
    return this.formatLoja(loja);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.loja.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async addDepartamento(
    lojaId: number,
    dto: CreateRvdVendaConfigDto,
  ): Promise<LojaResponse> {
    await this.findOne(lojaId);
    await this.prisma.rvdVendaConfig.create({
      data: { ...dto, loja_id: lojaId },
    });
    return this.findOne(lojaId);
  }

  async updateDepartamento(
    lojaId: number,
    depId: number,
    dto: UpdateRvdVendaConfigDto,
  ): Promise<LojaResponse> {
    await this.prisma.rvdVendaConfig.update({
      where: { id: depId },
      data: dto,
    });
    return this.findOne(lojaId);
  }

  async removeDepartamento(lojaId: number, depId: number): Promise<LojaResponse> {
    await this.prisma.rvdVendaConfig.update({
      where: { id: depId },
      data: { ativo: false },
    });
    return this.findOne(lojaId);
  }
}