import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UsePipes,
} from '@nestjs/common';
import { RvdVendaService } from './rvd-venda.service';
import { CreateRvdVendaSchema } from './dto/create-rvd-venda.dto';
import type { CreateRvdVendaDto } from './dto/create-rvd-venda.dto';
import { UpdateManualInsertSchema } from './dto/update-rvd-venda.dto';
import type { UpdateManualInsertDto } from './dto/update-rvd-venda.dto';
import { ZodValidationPipe } from '../../shared/pipes/zod-validation.pipe';


@Controller('rvd-venda')
export class RvdVendaController {
  constructor(private readonly rvdVendaService: RvdVendaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateRvdVendaSchema.array()))
  createOrUpdate(@Body() vendas: CreateRvdVendaDto[]) {
    return this.rvdVendaService.createOrUpdate(vendas);
  }

  @Post('create-manual-insert')
  @UsePipes(new ZodValidationPipe(CreateRvdVendaSchema))
  createManualInsert(@Body() venda: CreateRvdVendaDto) {
    return this.rvdVendaService.createManualInsert(venda);
  }

  @Patch('update-manual-insert')
  @UsePipes(new ZodValidationPipe(UpdateManualInsertSchema))
  updateManualInsert(@Body() dto: UpdateManualInsertDto) {
    return this.rvdVendaService.updateManualInsert(dto);
  }

  @Delete('loja/:loja_idloja/chave-proposta/:chave_proposta')
  removeByStoreAndProposalKey(
    @Param('loja_idloja', ParseIntPipe) loja_idloja: number,
    @Param('chave_proposta') chave_proposta: string,
  ) {
    return this.rvdVendaService.removeByStoreAndProposalKey(
      loja_idloja,
      chave_proposta,
    );
  }
}