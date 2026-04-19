import { PrismaService } from '../../prisma/prisma.service';
import type { CreateLojaDto, UpdateLojaDto, CreateRvdVendaConfigDto, UpdateRvdVendaConfigDto, LojaResponse } from './loja.interface';
export declare class LojaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private formatLoja;
    findAll(): Promise<LojaResponse[]>;
    findOne(id: number): Promise<LojaResponse>;
    create(dto: CreateLojaDto): Promise<LojaResponse>;
    update(id: number, dto: UpdateLojaDto): Promise<LojaResponse>;
    remove(id: number): Promise<void>;
    addDepartamento(lojaId: number, dto: CreateRvdVendaConfigDto): Promise<LojaResponse>;
    updateDepartamento(lojaId: number, depId: number, dto: UpdateRvdVendaConfigDto): Promise<LojaResponse>;
    removeDepartamento(lojaId: number, depId: number): Promise<LojaResponse>;
}
