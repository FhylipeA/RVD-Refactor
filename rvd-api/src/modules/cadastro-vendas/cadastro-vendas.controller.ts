import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
} from '@nestjs/common';
import { CadastroVendasService } from './cadastro-vendas.service';
import type { Integracao } from './cadastro-vendas.interface';

@Controller('rvd-venda')
export class CadastroVendasController {
  constructor(private readonly cadastroVendasService: CadastroVendasService) {}

  @Post('find-vendas')
  findVendas(
    @Body('idLoja') idLoja: number,
    @Body('periodo') periodo: string,
    @Body('integracao') integracao: Integracao,
  ) {
    return this.cadastroVendasService.findVendasVeiculos(
      idLoja,
      periodo,
      integracao,
    );
  }

  @Post('update-vendas')
  updateVendas(@Body('vendas') vendas: any[]) {
    return this.cadastroVendasService.updateVendas(vendas);
  }

  @Post('get-vendedores')
  getVendedores(@Body('integracao') integracao: Integracao) {
    return this.cadastroVendasService.getVendedoresBI(integracao);
  }

  @Post('valida-premium')
  validaPremium(@Body('integracao') integracao: Integracao) {
    return this.cadastroVendasService.validaAFaturarPremium(integracao);
  }

  @Get('bancos')
  getBancos() {
    return this.cadastroVendasService.getBancos();
  }

  @Get('consorcios')
  getConsorcios() {
    return this.cadastroVendasService.getConsorcios();
  }
}