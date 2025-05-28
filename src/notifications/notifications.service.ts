import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TrainingsService } from '../trainings/trainings.service';
import { FindTrainingArgs } from '../trainings/args/find-training.args';
import { TrainingStatus } from '../trainings/enums/training-status';
import { TrainingType } from '../trainings/enums/training-type.enum';
import { GroupsService } from '../groups/groups.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsGateway: NotificationsGateway,
    private readonly trainingsService: TrainingsService,
    private readonly groupsService: GroupsService,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async checkUpcomingTrainings() {
    const args = new FindTrainingArgs();

    args.status = TrainingStatus.FUTURE;

    const upcomingTrainings = await this.trainingsService.complexSearch(args);

    for (const training of upcomingTrainings) {
      const timeUntilTraining = training.date.getTime() - Date.now();
      const threeHoursInMs = 3 * 60 * 60 * 1000;

      if (timeUntilTraining <= threeHoursInMs && timeUntilTraining > 0) {
        const message = `Reminder: training starts at ${training.date.toLocaleTimeString()}`;

        if (training.trainingType === TrainingType.INDIVIDUAL) {
          if (training.trainee?.id) {
            this.notificationsGateway.sendReminder(
              training.trainee.id.toString(),
              message,
            );
          }
        } else if (training.trainingType === TrainingType.GROUP) {
          if (training.traineeGroup) {
            const groupMembers = await this.groupsService.findAllMembers(
              training.traineeGroup,
            );
            for (const member of groupMembers) {
              if (member?.id) {
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
}
