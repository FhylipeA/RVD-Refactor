import { Test, TestingModule } from '@nestjs/testing';
import { RvdVendaController } from './rvd-venda.controller';
import { RvdVendaService } from './rvd-venda.service';

describe('RvdVendaController', () => {
  let controller: RvdVendaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RvdVendaController],
      providers: [RvdVendaService],
    }).compile();

    controller = module.get<RvdVendaController>(RvdVendaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
