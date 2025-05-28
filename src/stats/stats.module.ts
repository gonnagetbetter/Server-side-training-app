import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsReportService } from './stats.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CacheModule } from '../cache/cache.module';
import { StatsReport } from './entities/stats-report.entity';
import { UsersModule } from '../users/users.module';
import { TrainingsModule } from '../trainings/trainings.module';
import { ExerciseSetModule } from '../exercise-set/exercise-set.module';
import { ExerciseModule } from '../exercise/exercise.module';
import { GroupsModule } from '../groups/groups.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([StatsReport]),
    CacheModule.forRootFromConfig(),
    UsersModule,
    TrainingsModule,
    ExerciseSetModule,
    ExerciseModule,
    GroupsModule,
  ],
  controllers: [StatsController],
  providers: [StatsReportService],
  exports: [StatsReportService],
})
export class StatsModule {}
