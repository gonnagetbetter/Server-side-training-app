import { Injectable } from '@nestjs/common';
import { StatsReport } from './entities/stats-report.entity';
import { BasicCrudService } from '../common/basic-crud.service';
import { CacheService } from '../cache/cache.service';
import { EntityManager } from '@mikro-orm/core';
import { StatsReportRepository } from './repositories/stats-report.repository';
import { User } from '../users/entities/user.entity';
import { CreateStatsReportDto } from './dto/create-stats-report';
import { UsersService } from '../users/users.service';
import { TrainingsService } from '../trainings/trainings.service';
import { TrainingStatus } from '../trainings/enums/training-status';
import { FindTrainingArgs } from '../trainings/args/find-training.args';
import { ExerciseSetService } from '../exercise-set/exercise-set.service';
import { GetGeneralStatsDto } from './dto/get-general-stats.dto';
import { GetTrainerStatsDto } from './dto/get-trainer-stats.dto';

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

  async createAttendanceReport(dto: CreateStatsReportDto, usedId: number) {
    const madeBy = await this.usersService.findOne(usedId);
    if (!madeBy) {
      throw new Error(`User with id ${usedId} not found`);
    }

    const individualArgs = new FindTrainingArgs();
    individualArgs.status = TrainingStatus.FINISHED;
    individualArgs.trainee = usedId;
    const individualTrainings =
      await this.trainingsService.complexSearch(individualArgs);

    const groupArgs = new FindTrainingArgs();
    groupArgs.status = TrainingStatus.FINISHED;
    if (madeBy.group) {
      groupArgs.traineeGroup = madeBy.group.id;
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

  async getGeneralStats(dto: GetGeneralStatsDto) {
    let startDate: Date;
    let endDate: Date;

    if (dto.startDate && dto.endDate) {
      startDate = new Date(dto.startDate);
      endDate = new Date(dto.endDate);
    } else {
      endDate = new Date();
      startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 1); // По умолчанию за последний месяц
    }

    const trainingArgs = new FindTrainingArgs();
    trainingArgs.status = TrainingStatus.FINISHED;
    const allTrainings =
      await this.trainingsService.complexSearch(trainingArgs);
    const trainingsInPeriod = allTrainings.filter(
      (training) => training.date >= startDate && training.date <= endDate,
    );

    const allUsers = await this.usersService.complexSearch({});

    const newUsers = allUsers.filter(
      (user) => user.createdAt && user.createdAt >= startDate && user.createdAt <= endDate,
    );

    const activeUserIds = new Set(
      trainingsInPeriod.map((training) => training.trainee?.id).filter((id): id is number => id !== undefined),
    );
    const inactiveUsers = allUsers.filter(
      (user) => user.id && !activeUserIds.has(user.id),
    );

    return {
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
  }

  async getTrainerStats(dto: GetTrainerStatsDto) {
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

    const trainingArgs = new FindTrainingArgs();
    trainingArgs.status = TrainingStatus.FINISHED;
    trainingArgs.trainer = dto.trainerId;
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

    return {
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
  }
}
