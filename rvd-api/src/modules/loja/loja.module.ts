import { Module } from '@nestjs/common';
import { LojaController } from './loja.controller';
import { LojaService } from './loja.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LojaController],
  providers: [LojaService],
  exports: [LojaService],
})
export class LojaModule {}