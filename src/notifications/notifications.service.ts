import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TrainingsService } from '../trainings/trainings.service';
import { FindTrainingArgs } from '../trainings/args/find-training.args';
import { TrainingStatus } from '../trainings/enums/training-status';
import { EntityManager } from '@mikro-orm/postgresql';
import { TrainingType } from '../trainings/enums/training-type.enum';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsGateway: NotificationsGateway,
    private readonly trainingsService: TrainingsService,
    private readonly entityManager: EntityManager,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkUpcomingTrainings() {
    const em = this.entityManager.fork();
    const args = new FindTrainingArgs();

    args.status = TrainingStatus.FUTURE;

    const upcomingTrainings = await this.trainingsService.complexSearch(args);

    for (const training of upcomingTrainings) {
      const timeUntilTraining = training.date.getTime() - Date.now();
      const threeHoursInMs = 3 * 60 * 60 * 1000;

      if (timeUntilTraining <= threeHoursInMs && timeUntilTraining > 0) {
        const message = `Reminder: training starts at ${training.date.toLocaleTimeString()}`;

        if (training.trainingType === TrainingType.INDIVIDUAL) {
          // For individual training, send notification only to the trainee
          if (training.trainee) {
            this.notificationsGateway.sendReminder(
              training.trainee.id.toString(),
              message,
            );
          }
        } else if (training.trainingType === TrainingType.GROUP) {
          // For group training, send notification to all group members
          if (training.traineeGroup) {
            const groupMembers = await em.find(User, {
              group: training.traineeGroup,
            });
            for (const member of groupMembers) {
              this.notificationsGateway.sendReminder(
                member.id.toString(),
                message,
              );
            }
          }
        }
      }
    }
  }
}
