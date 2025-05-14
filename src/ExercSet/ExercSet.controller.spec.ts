import { Test, TestingModule } from '@nestjs/testing';
import { ExercSetController } from './ExercSet.controller';

describe('ExercSetController', () => {
  let controller: ExercSetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExercSetController],
    }).compile();

    controller = module.get<ExercSetController>(ExercSetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
