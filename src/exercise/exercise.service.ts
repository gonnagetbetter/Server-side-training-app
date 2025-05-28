import { Injectable } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { EntityManager, FilterQuery } from '@mikro-orm/core';
import { ExerciseRepository } from './repositories/exercise.repository';
import { Exercise } from './entities/exercise.entity';
import { BasicCrudService } from '../common/basic-crud.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { FindExerciseArgs } from './args/find-exercise.args';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExerciseService extends BasicCrudService<Exercise> {
  constructor(
    protected readonly cacheService: CacheService,
    protected readonly exerciseRepository: ExerciseRepository,
    protected readonly entityManager: EntityManager,
  ) {
    super(Exercise, exerciseRepository, cacheService, entityManager);
  }

  async findAll(args: FindExerciseArgs) {
    const filter: FilterQuery<Exercise> = {};

    if (args.name) {
      filter.name = { $eq: args.name };
    }

    if (args.startWeight) {
      filter.startWeight = { $eq: args.startWeight };
    }

    if (args.endWeight) {
      filter.endWeight = { $eq: args.endWeight };
    }

    if (args.weightIncrement) {
      filter.weightIncrement = { $eq: args.weightIncrement };
    }

    if (args.setsNum) {
      filter.setsNum = { $eq: args.setsNum };
    }

    if (args.repsNum) {
      filter.repsNum = { $eq: args.repsNum };
    }

    return this.findMany(filter);
  }

  async findOneSafe(id: number) {
    const filter: FilterQuery<Exercise> = { id };

    return this.findOneOrFail(filter);
  }

  async create(dto: CreateExerciseDto) {
    return this.createOne({
      ...dto,
      exerciseSets: [],
    });
  }

  async update(dto: UpdateExerciseDto) {
    const { id } = dto;
    const filter: FilterQuery<Exercise> = { id };

    return this.updateOne(filter, dto);
  }

  async remove(id: number) {
    const filter: FilterQuery<Exercise> = { id };

    return this.deleteOne(filter);
  }
}
