import { Injectable } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { EntityManager, FilterQuery } from '@mikro-orm/core';
import { BasicCrudService } from '../common/basic-crud.service';
import { ExerciseService } from '../exercise/exercise.service';
import { ExerciseSet } from './entities/exercise-set.entity';
import { ExerciseSetRepository } from './repositories/exercise-set.repository';
import { FindExerciseSetArgs } from './args/find-exercise-set.args';
import { CreateExerciseSetDto } from './dto/create-exercise-set.dto';
import { UpdateExerciseSetDto } from './dto/update-exercise-set.dto';

@Injectable()
export class ExerciseSetService extends BasicCrudService<ExerciseSet> {
  constructor(
    protected readonly cacheService: CacheService,
    protected readonly exerciseSetRepository: ExerciseSetRepository,
    protected readonly entityManager: EntityManager,
    protected readonly exerciseService: ExerciseService,
  ) {
    super(ExerciseSet, exerciseSetRepository, cacheService, entityManager);
  }

  async findAll(args: FindExerciseSetArgs) {
    const filter: FilterQuery<ExerciseSet> = {};

    if (args.name) {
      filter.name = { $eq: args.name };
    }

    return this.findMany(filter);
  }

  async findOneSafe(id: number) {
    const filter: FilterQuery<ExerciseSet> = { id };

    return this.findOneOrFail(filter);
  }

  async create(dto: CreateExerciseSetDto) {
    const exercises = await Promise.all(
      dto.exerciseIds.map((id) => this.exerciseService.findOneSafe(id)),
    );

    return this.createOne({
      name: dto.name,
      exercises,
      trainings: [],
    });
  }

  async update(dto: UpdateExerciseSetDto) {
    const { id, exerciseIds, ...rest } = dto;
    const filter: FilterQuery<ExerciseSet> = { id };

    const updateData: Partial<ExerciseSet> = { ...rest };

    if (exerciseIds) {
      const exercises = await Promise.all(
        exerciseIds.map((id) => this.exerciseService.findOneSafe(id)),
      );

      updateData.exercises = exercises;
    }

    return this.updateOne(filter, updateData);
  }

  async remove(id: number) {
    const filter: FilterQuery<ExerciseSet> = { id };

    return this.deleteOne(filter);
  }

  async getExerciseIds(setId: number): Promise<number[]> {
    const exerciseSet = await this.findOneSafe(setId);
    await this.entityManager.populate(exerciseSet, ['exercises']);
    return exerciseSet.exercises.map(exercise => exercise.id);
  }
}
