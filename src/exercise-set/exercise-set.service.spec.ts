import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseSetService } from './exercise-set.service';

describe('ExerciseSetService', () => {
  let service: ExerciseSetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExerciseSetService],
    }).compile();

    service = module.get<ExerciseSetService>(ExerciseSetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
