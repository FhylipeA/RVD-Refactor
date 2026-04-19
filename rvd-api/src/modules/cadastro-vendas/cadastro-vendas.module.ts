import { Module } from '@nestjs/common';
import { CadastroVendasController } from './cadastro-vendas.controller';
import { CadastroVendasService } from './cadastro-vendas.service';
import { RvdVendaModule } from '../rvd-venda/rvd-venda.module';
import { IntegradorDmsNbsModule } from '../integrador-dms-nbs/integrador-dms-nbs.module';

@Module({
  imports: [RvdVendaModule, IntegradorDmsNbsModule],
  controllers: [CadastroVendasController],
  providers: [CadastroVendasService],
})
export class CadastroVendasModule {}