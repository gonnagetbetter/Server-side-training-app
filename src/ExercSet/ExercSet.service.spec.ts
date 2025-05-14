import { Test, TestingModule } from '@nestjs/testing';
import { ExercSetService } from './ExercSet.service';

describe('ExercSetService', () => {
  let service: ExercSetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExercSetService],
    }).compile();

    service = module.get<ExercSetService>(ExercSetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
