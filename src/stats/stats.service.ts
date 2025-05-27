import { Injectable } from '@nestjs/common';
import { StatsReport } from './entities/stats-report.entity';
import { BasicCrudService } from '../common/basic-crud.service';
import { CacheService } from '../cache/cache.service';
import { EntityManager } from '@mikro-orm/core';
import { StatsReportRepository } from './repositories/stats-report.repository';
import { User } from '../users/entities/user.entity';
import { CreateStatsReportDto } from './dto/create-stats-report.dto';
import { UsersService } from '../users/users.service';
import { TrainingsService } from '../trainings/trainings.service';
import { TrainingStatus } from '../trainings/enums/training-status';
import { FindTrainingArgs } from '../trainings/args/find-training.args';
import { ExerciseSetService } from '../exercise-set/exercise-set.service';
import { GetGeneralStatsDto } from './dto/get-general-stats.dto';
import { GetTrainerStatsDto } from './dto/get-trainer-stats.dto';
import { UserMetadata } from '../auth/types/user-metadata.type';

@Injectable()
export class StatsReportService extends BasicCrudService<StatsReport> {
  constructor(
    protected readonly cacheService: CacheService,
    protected readonly statsReportRepository: StatsReportRepository,
    protected readonly entityManager: EntityManager,
    protected readonly usersService: UsersService,
    protected readonly trainingsService: TrainingsService,
    protected readonly exerciseSetService: ExerciseSetService,
  ) {
    super(StatsReport, statsReportRepository, cacheService, entityManager);
  }

  async create(dto: CreateStatsReportDto, madeBy: User, data: any) {
    return this.createOne({
      ...dto,
      madeBy,
      data,
      createdAt: new Date(),
    });
  }

  async createAttendanceReport(dto: CreateStatsReportDto, meta: UserMetadata) {
    if (!dto.madeFor || !dto.monthsNum) {
      throw new Error('You must specify a user to generate report for');
    }

    const madeFor = await this.usersService.findOne(dto.madeFor);

    if (!madeFor) {
      throw new Error(`User with id ${meta.userId} not found`);
    }

    if (meta.userRole == 'USER' && dto.madeFor != meta.userId) {
      throw new Error('You are not allowed to create this report');
    }

    if (meta.userRole == 'TRAINER' && madeFor.trainerId != meta.userId) {
      throw new Error('You are not allowed to create this report');
    }

    const madeBy = await this.usersService.findOneOrFail(meta.userId);

    const individualArgs = new FindTrainingArgs();
    individualArgs.status = TrainingStatus.FINISHED;
    individualArgs.trainee = madeFor.id;
    const individualTrainings =
      await this.trainingsService.complexSearch(individualArgs);

    const groupArgs = new FindTrainingArgs();
    groupArgs.status = TrainingStatus.FINISHED;
    if (madeFor.group) {
      groupArgs.traineeGroup = madeFor.group.id;
    }
    const groupTrainings = await this.trainingsService.complexSearch(groupArgs);

    const allTrainings = [...individualTrainings, ...groupTrainings];

    let startDate: Date;
    let endDate: Date;

    if (dto.startDate && dto.endDate) {
      startDate = new Date(dto.startDate);
      endDate = new Date(dto.endDate);
    } else {
      endDate = new Date();
      startDate = new Date();
      startDate.setMonth(endDate.getMonth() - dto.monthsNum);
    }

    const trainingsInPeriod = allTrainings.filter(
      (training) => training.date >= startDate && training.date <= endDate,
    );

    const exerciseStats = new Map();

    for (const training of trainingsInPeriod) {
      if (training.ExerciseSetId) {
        const exerciseSet = await this.exerciseSetService.findOne(
          training.ExerciseSetId,
        );
        if (exerciseSet && exerciseSet.exercises) {
          for (const exercise of exerciseSet.exercises) {
            if (!exerciseStats.has(exercise.id)) {
              exerciseStats.set(exercise.id, {
                name: exercise.name,
                minWeight: exercise.startWeight,
                maxWeight: exercise.endWeight,
                count: 1,
              });
            } else {
              const stats = exerciseStats.get(exercise.id);
              stats.minWeight = Math.min(stats.minWeight, exercise.startWeight);
              stats.maxWeight = Math.max(stats.maxWeight, exercise.endWeight);
              stats.count++;
            }
          }
        }
      }
    }

    const totalTrainings = trainingsInPeriod.length;
    const weeksInPeriod = Math.max(
      1,
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000),
      ),
    );
    const averageTrainingsPerWeek = totalTrainings / weeksInPeriod;

    const data = {
      totalTrainings,
      averageTrainingsPerWeek,
      period: {
        start: startDate,
        end: endDate,
      },
      breakdown: {
        individualTrainings: individualTrainings.filter(
          (t) => t.date >= startDate && t.date <= endDate,
        ).length,
        groupTrainings: groupTrainings.filter(
          (t) => t.date >= startDate && t.date <= endDate,
        ).length,
      },
      exercises: Array.from(exerciseStats.values()).map((stats) => ({
        name: stats.name,
        minWeight: stats.minWeight,
        maxWeight: stats.maxWeight,
        timesPerformed: stats.count,
      })),
    };

    return this.create(dto, madeBy, data);
  }

  async getGeneralStats(dto: GetGeneralStatsDto, meta: UserMetadata) {
    const madeBy = await this.usersService.findOneOrFail(meta.userId);

    const creationDto: CreateStatsReportDto = new CreateStatsReportDto();

    let startDate: Date;
    let endDate: Date;

    if (dto.startDate && dto.endDate) {
      startDate = new Date(dto.startDate);
      endDate = new Date(dto.endDate);
    } else {
      endDate = new Date();
      startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 1);
    }

    creationDto.startDate = startDate;
    creationDto.endDate = endDate;

    const trainingArgs = new FindTrainingArgs();
    trainingArgs.status = TrainingStatus.FINISHED;
    const allTrainings =
      await this.trainingsService.complexSearch(trainingArgs);
    const trainingsInPeriod = allTrainings.filter(
      (training) => training.date >= startDate && training.date <= endDate,
    );

    const allUsers = await this.usersService.complexSearch({});

    const newUsers = allUsers.filter(
      (user) =>
        user.createdAt &&
        user.createdAt >= startDate &&
        user.createdAt <= endDate,
    );

    const activeUserIds = new Set(
      trainingsInPeriod
        .map((training) => training.trainee?.id)
        .filter((id): id is number => id !== undefined),
    );
    const inactiveUsers = allUsers.filter(
      (user) => user.id && !activeUserIds.has(user.id),
    );

    const data = {
      period: {
        start: startDate,
        end: endDate,
      },
      totalTrainings: trainingsInPeriod.length,
      newUsers: newUsers.length,
      inactiveUsers: inactiveUsers.length,
      breakdown: {
        individualTrainings: trainingsInPeriod.filter((t) => !t.traineeGroup)
          .length,
        groupTrainings: trainingsInPeriod.filter((t) => t.traineeGroup).length,
      },
    };

    return this.create(creationDto, madeBy, data);
  }

  async getTrainerStats(dto: GetTrainerStatsDto, meta: UserMetadata) {
    if (meta.userRole != 'ADMIN' && meta.userId != dto.madeFor) {
      throw new Error('You are not allowed to create this report');
    }

    const creationDto: CreateStatsReportDto = new CreateStatsReportDto();
    const madeBy = await this.usersService.findOneOrFail(meta.userId);
    creationDto.madeFor = dto.madeFor;

    let startDate: Date;
    let endDate: Date;

    if (dto.startDate && dto.endDate) {
      startDate = new Date(dto.startDate);
      endDate = new Date(dto.endDate);
    } else {
      endDate = new Date();
      startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 1);
    }

    creationDto.startDate = startDate;
    creationDto.endDate = endDate;

    const trainingArgs = new FindTrainingArgs();
    trainingArgs.status = TrainingStatus.FINISHED;
    trainingArgs.trainer = dto.madeFor;
    const allTrainings =
      await this.trainingsService.complexSearch(trainingArgs);
    const trainingsInPeriod = allTrainings.filter(
      (training) => training.date >= startDate && training.date <= endDate,
    );

    const uniqueTrainees = new Set(
      trainingsInPeriod.map((training) => training.trainee.id),
    );

    const firstTrainingDates = new Map();
    for (const training of allTrainings) {
      const traineeId = training.trainee.id;
      if (
        !firstTrainingDates.has(traineeId) ||
        training.date < firstTrainingDates.get(traineeId)
      ) {
        firstTrainingDates.set(traineeId, training.date);
      }
    }

    const newTrainees = Array.from(firstTrainingDates.entries())
      .filter(([_, date]) => date >= startDate && date <= endDate)
      .map(([id]) => id);

    const data = {
      period: {
        start: startDate,
        end: endDate,
      },
      totalTrainings: trainingsInPeriod.length,
      uniqueTrainees: uniqueTrainees.size,
      newTrainees: newTrainees.length,
      breakdown: {
        individualTrainings: trainingsInPeriod.filter((t) => !t.traineeGroup)
          .length,
        groupTrainings: trainingsInPeriod.filter((t) => t.traineeGroup).length,
      },
    };

    return this.create(creationDto, madeBy, data);
  }
}
