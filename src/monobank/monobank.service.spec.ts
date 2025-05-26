import { Test, TestingModule } from '@nestjs/testing';
import { MonobankService } from './monobank-client';

describe('MonobankService', () => {
  let service: MonobankService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonobankService],
    }).compile();

    service = module.get<MonobankService>(MonobankService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
