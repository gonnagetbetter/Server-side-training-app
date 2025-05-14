import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UsersModule } from './users/users.module';
import { TrainingsModule } from './trainings/trainings.module';
import { GroupsModule } from './groups/groups.module';
import { StatsModule } from './stats/stats.module';
import { ExercSetModule } from './ExercSet/ExercSet.module';
import { ExerciseModule } from './exercise/exercise.module';
import MikroOrmConfig from './mikro-orm.config';

@Module({
  imports: [
    MikroOrmModule.forRoot(MikroOrmConfig),
    UsersModule,
    TrainingsModule,
    GroupsModule,
    StatsModule,
    ExercSetModule,
    ExerciseModule,
  ],
})
export class AppModule {}
