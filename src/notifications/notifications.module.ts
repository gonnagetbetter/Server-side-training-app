import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { ScheduleModule } from '@nestjs/schedule';
import { TrainingsModule } from '../trainings/trainings.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Training } from '../trainings/entities/training.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TrainingsModule,
    MikroOrmModule.forFeature([Training]),
  ],
  providers: [NotificationsService, NotificationsGateway],
  exports: [NotificationsService],
})
export class NotificationsModule {}
