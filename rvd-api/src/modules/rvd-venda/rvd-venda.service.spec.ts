import { Test, TestingModule } from '@nestjs/testing';
import { RvdVendaService } from './rvd-venda.service';

describe('RvdVendaService', () => {
  let service: RvdVendaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RvdVendaService],
    }).compile();

    service = module.get<RvdVendaService>(RvdVendaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
