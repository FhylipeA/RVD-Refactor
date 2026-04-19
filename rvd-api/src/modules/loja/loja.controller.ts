import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { LojaService } from './loja.service';
import type {
  CreateLojaDto,
  UpdateLojaDto,
  CreateRvdVendaConfigDto,
  UpdateRvdVendaConfigDto,
} from './loja.interface';

@Controller('lojas')
export class LojaController {
  constructor(private readonly lojaService: LojaService) {}

  @Get()
  findAll() {
    return this.lojaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lojaService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateLojaDto) {
    return this.lojaService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLojaDto,
  ) {
    return this.lojaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lojaService.remove(id);
  }

  @Post(':id/departamentos')
  addDepartamento(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateRvdVendaConfigDto,
  ) {
    return this.lojaService.addDepartamento(id, dto);
  }

  @Patch(':id/departamentos/:depId')
  updateDepartamento(
    @Param('id', ParseIntPipe) id: number,
    @Param('depId', ParseIntPipe) depId: number,
    @Body() dto: UpdateRvdVendaConfigDto,
  ) {
    return this.lojaService.updateDepartamento(id, depId, dto);
  }

  @Delete(':id/departamentos/:depId')
  removeDepartamento(
    @Param('id', ParseIntPipe) id: number,
    @Param('depId', ParseIntPipe) depId: number,
  ) {
    return this.lojaService.removeDepartamento(id, depId);
  }
}