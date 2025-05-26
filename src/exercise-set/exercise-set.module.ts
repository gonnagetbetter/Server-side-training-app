import { Module } from '@nestjs/common';
import { ExerciseSetService } from './exercise-set.service';
import { ExerciseSetController } from './exercise-set.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CacheModule } from '../cache/cache.module';
import { ExerciseModule } from '../exercise/exercise.module';
import { ExerciseSet } from './entities/exercise-set.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([ExerciseSet]),
    CacheModule.forRootFromConfig(),
    ExerciseModule,
  ],
  controllers: [ExerciseSetController],
  providers: [ExerciseSetService],
  exports: [ExerciseSetService],
})
export class ExerciseSetModule {}
