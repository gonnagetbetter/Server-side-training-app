import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SeedCommand } from './seed.command';
import { User } from '../../users/entities/user.entity';
import { Group } from '../../groups/entities/group.entity';
import { Exercise } from '../../exercise/entities/exercise.entity';
import { ExerciseSet } from '../../exercise-set/entities/exercise-set.entity';
import { Training } from '../../trainings/entities/training.entity';

@Module({
  imports: [
    CommandModule,
    MikroOrmModule.forFeature([User, Group, Exercise, ExerciseSet, Training]),
  ],
  providers: [SeedCommand],
  exports: [SeedCommand],
})
export class SeedersModule {}
