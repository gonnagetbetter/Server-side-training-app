import { Injectable } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { EntityManager, FilterQuery } from '@mikro-orm/core';
import { ExercSetRepository } from './repositories/set.repository';
import { ExercSet } from './entities/ExercSet.entity';
import { BasicCrudService } from '../common/basic-crud.service';
import { CreateExercSetDto } from './dto/create-exerc-set.dto';
import { FindExercSetArgs } from './args/find-exerc-set.args';
import { UpdateExercSetDto } from './dto/update-exerc-set.dto';
import { ExerciseService } from '../exercise/exercise.service';

@Injectable()
export class ExercSetService extends BasicCrudService<ExercSet> {
  constructor(
    protected readonly cacheService: CacheService,
    protected readonly exercSetRepository: ExercSetRepository,
    protected readonly entityManager: EntityManager,
    protected readonly exerciseService: ExerciseService,
  ) {
    super(ExercSet, exercSetRepository, cacheService, entityManager);
  }

  async findAll(args: FindExercSetArgs) {
    const filter: FilterQuery<ExercSet> = {};

    if (args.name) {
      filter.name = { $eq: args.name };
    }

    return this.findMany(filter);
  }

  async findOneSafe(id: number) {
    const filter: FilterQuery<ExercSet> = { id };

    return this.findOneOrFail(filter);
  }

  async create(dto: CreateExercSetDto) {
    const exercises = await Promise.all(
      dto.exerciseIds.map((id) => this.exerciseService.findOneSafe(id)),
    );

    return this.createOne({
      name: dto.name,
      exercises,
      trainings: [],
    });
  }

  async update(dto: UpdateExercSetDto) {
    const { id, exerciseIds, ...rest } = dto;
    const filter: FilterQuery<ExercSet> = { id };

    const updateData: Partial<ExercSet> = { ...rest };

    if (exerciseIds) {
      const exercises = await Promise.all(
        exerciseIds.map((id) => this.exerciseService.findOneSafe(id)),
      );

      updateData.exercises = exercises;
    }

    return this.updateOne(filter, updateData);
  }

  async remove(id: number) {
    const filter: FilterQuery<ExercSet> = { id };

    return this.deleteOne(filter);
  }
}
