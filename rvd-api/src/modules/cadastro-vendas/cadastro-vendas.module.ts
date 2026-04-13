import { Module } from '@nestjs/common';
import { CadastroVendasController } from './cadastro-vendas.controller';
import { CadastroVendasService } from './cadastro-vendas.service';
import { RvdVendaModule } from '../rvd-venda/rvd-venda.module';

@Module({
  imports: [RvdVendaModule],
  controllers: [CadastroVendasController],
  providers: [CadastroVendasService],
})
export class CadastroVendasModule {}