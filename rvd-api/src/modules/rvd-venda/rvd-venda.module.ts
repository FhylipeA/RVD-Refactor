import { Module } from '@nestjs/common';
import { RvdVendaService } from './rvd-venda.service';
import { RvdVendaController } from './rvd-venda.controller';

@Module({
  controllers: [RvdVendaController],
  providers: [RvdVendaService],
  exports: [RvdVendaService],
})
export class RvdVendaModule {}