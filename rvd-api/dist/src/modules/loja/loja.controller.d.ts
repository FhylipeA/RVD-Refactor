import { LojaService } from './loja.service';
import type { CreateLojaDto, UpdateLojaDto, CreateRvdVendaConfigDto, UpdateRvdVendaConfigDto } from './loja.interface';
export declare class LojaController {
    private readonly lojaService;
    constructor(lojaService: LojaService);
    findAll(): Promise<import("./loja.interface").LojaResponse[]>;
    findOne(id: number): Promise<import("./loja.interface").LojaResponse>;
    create(dto: CreateLojaDto): Promise<import("./loja.interface").LojaResponse>;
    update(id: number, dto: UpdateLojaDto): Promise<import("./loja.interface").LojaResponse>;
    remove(id: number): Promise<void>;
    addDepartamento(id: number, dto: CreateRvdVendaConfigDto): Promise<import("./loja.interface").LojaResponse>;
    updateDepartamento(id: number, depId: number, dto: UpdateRvdVendaConfigDto): Promise<import("./loja.interface").LojaResponse>;
    removeDepartamento(id: number, depId: number): Promise<import("./loja.interface").LojaResponse>;
}
