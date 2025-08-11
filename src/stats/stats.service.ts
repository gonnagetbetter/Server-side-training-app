import { BadRequestException, Injectable } from '@nestjs/common';
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
import { ExerciseService } from '../exercise/exercise.service';
import { GetGeneralStatsDto } from './dto/get-general-stats.dto';
import { GetTrainerStatsDto } from './dto/get-trainer-stats.dto';
import { UserMetadata } from '../auth/types/user-metadata.type';
import { Training } from '../trainings/entities/training.entity';
import { GroupsService } from '../groups/groups.service';
import { UserRole } from '../users/enums/user-role.enum';

@Injectable()
export class StatsReportService extends BasicCrudService<StatsReport> {
  constructor(
    protected readonly cacheService: CacheService,
    protected readonly statsReportRepository: StatsReportRepository,
    protected readonly entityManager: EntityManager,
    protected readonly usersService: UsersService,
    protected readonly trainingsService: TrainingsService,
    protected readonly exerciseSetService: ExerciseSetService,
    protected readonly exerciseService: ExerciseService,
    protected readonly groupsService: GroupsService,
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

  async getReport(id: number, meta: UserMetadata): Promise<StatsReport> {
    const report = await this.findOneOrFail(id);
    const requester = await this.usersService.findOneOrFail(meta.userId);

    if (meta.userRole !== UserRole.ADMIN && report.madeBy !== requester) {
      throw new BadRequestException();
    }
    return report;
  }

  async createAttendanceReport(dto: CreateStatsReportDto, meta: UserMetadata) {
    if (!dto.madeFor) {
      throw new BadRequestException(
        'You must specify a user to generate report for',
      );
    }

    const madeFor = await this.usersService.findOne(dto.madeFor);

    if (!madeFor) {
      throw new BadRequestException(`User with id ${meta.userId} not found`);
    }

    if (meta.userRole == 'USER' && dto.madeFor != meta.userId) {
      throw new BadRequestException(
        'You are not allowed to create this report',
      );
    }

    if (meta.userRole == 'TRAINER' && madeFor.trainer.id != meta.userId) {
      throw new BadRequestException(
        'You are not allowed to create this report',
      );
    }

    const madeBy = await this.usersService.findOneOrFail(meta.userId);

    const allTrainings: Training[] = [];

    const individualArgs = new FindTrainingArgs();
    individualArgs.status = TrainingStatus.FINISHED;
    individualArgs.trainee = madeFor.id;
    const individualTrainings =
      await this.trainingsService.complexSearch(individualArgs);
    allTrainings.push(...individualTrainings);

    if (madeFor.group) {
      const groupArgs = new FindTrainingArgs();
      groupArgs.status = TrainingStatus.FINISHED;
      groupArgs.traineeGroup = madeFor.group.id;
      const groupTrainings =
        await this.trainingsService.complexSearch(groupArgs);

      allTrainings.push(...groupTrainings);
    }

    let startDate: Date;
    let endDate: Date;

    if (dto.startDate && dto.endDate) {
      startDate = new Date(dto.startDate);
      endDate = new Date(dto.endDate);
    } else {
      endDate = new Date();
      startDate = new Date();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      startDate.setMonth(endDate.getMonth() - dto.monthsNum);
    }

    const trainingsInPeriod = allTrainings.filter(
      (training) => training.date >= startDate && training.date <= endDate,
    );

    const exerciseStats = new Map();

    for (const training of trainingsInPeriod) {
      if (training.ExerciseSetId) {
        const exerciseSetIds = await this.exerciseSetService.getExerciseIds(
          training.ExerciseSetId,
        );
        if (exerciseSetIds) {
          for (const exerciseId of exerciseSetIds) {
            const exercise = await this.exerciseService.findOneSafe(exerciseId);
            const currentWeight = exercise.endWeight;

            if (!exerciseStats.has(exercise.name)) {
              exerciseStats.set(exercise.name, {
                minWeight: currentWeight,
                maxWeight: currentWeight,
                count: 1,
              });
            } else {
              const stats = exerciseStats.get(exercise.name);
              if (currentWeight < stats.minWeight) {
              }
              if (currentWeight > stats.maxWeight) {
                stats.maxWeight = currentWeight;
              }
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
        groupTrainings: trainingsInPeriod.length - individualTrainings.length,
      },
      exercises: Array.from(exerciseStats.entries()).map(([name, stats]) => ({
        name,
        minWeight: stats.minWeight,
        maxWeight: stats.maxWeight,
      })),
    };

    return this.create(dto, madeBy, data);
  }

  async getGeneralStats(dto: GetGeneralStatsDto, meta: UserMetadata) {
    const madeBy = await this.usersService.findOneOrFail(meta.userId);

    const creationDto: CreateStatsReportDto = new CreateStatsReportDto();

    let startDate: Date;
    let endDate: Date;

    if (dto.monthsNum) {
      endDate = new Date();
      startDate = new Date();
      startDate.setMonth(endDate.getMonth() - dto.monthsNum);
    } else if (dto.startDate && dto.endDate) {
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

    console.log(data);

    return this.create(creationDto, madeBy, data);
  }

  async getTrainerStats(dto: GetTrainerStatsDto, meta: UserMetadata) {
    if (meta.userRole != 'ADMIN' && meta.userId != dto.madeFor) {
      throw new BadRequestException(
        'You are not allowed to create this report',
      );
    }

    const creationDto: CreateStatsReportDto = new CreateStatsReportDto();
    const madeBy = await this.usersService.findOneOrFail(meta.userId);
    creationDto.madeFor = dto.madeFor;

    let startDate: Date;
    let endDate: Date;

    if (dto.monthsNum) {
      endDate = new Date();
      startDate = new Date();
      startDate.setMonth(endDate.getMonth() - dto.monthsNum);
    } else if (dto.startDate && dto.endDate) {
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

    const uniqueTrainees = new Set<number>();

    for (const training of trainingsInPeriod) {
      if (training.trainee) {
        uniqueTrainees.add(training.trainee.id);
      } else if (training.traineeGroup) {
        const groupMembers = await this.groupsService.findAllMembers(
          training.traineeGroup,
        );
        groupMembers.forEach(
          (member) => member.id && uniqueTrainees.add(member.id),
        );
      }
    }

    // Get all users from uniqueTrainees
    const trainees = await Promise.all(
      Array.from(uniqueTrainees).map((id) => this.usersService.findOne({ id })),
    );

    // Count new trainees
    const newTrainees = trainees.filter(
      (user) =>
        user &&
        user.createdAt &&
        user.createdAt >= startDate &&
        user.createdAt <= endDate,
    ).length;

    const data = {
      period: {
        start: startDate,
        end: endDate,
      },
      totalTrainings: trainingsInPeriod.length,
      uniqueTrainees: uniqueTrainees.size,
      newTrainees,
      breakdown: {
        individualTrainings: trainingsInPeriod.filter((t) => !t.traineeGroup)
          .length,
        groupTrainings: trainingsInPeriod.filter((t) => t.traineeGroup).length,
      },
    };

    return this.create(creationDto, madeBy, data);
  }
}
