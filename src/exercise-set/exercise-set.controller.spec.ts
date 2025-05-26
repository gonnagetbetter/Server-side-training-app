import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseSetController } from './exercise-set.controller';
import { ExerciseSetService } from './exercise-set.service';

describe('ExerciseSetController', () => {
  let controller: ExerciseSetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExerciseSetController],
      providers: [ExerciseSetService],
    }).compile();

    controller = module.get<ExerciseSetController>(ExerciseSetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
