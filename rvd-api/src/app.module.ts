import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { RvdVendaModule } from './modules/rvd-venda/rvd-venda.module';
import { CadastroVendasModule } from './modules/cadastro-vendas/cadastro-vendas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    RvdVendaModule,
    CadastroVendasModule,
  ],
})
export class AppModule {}