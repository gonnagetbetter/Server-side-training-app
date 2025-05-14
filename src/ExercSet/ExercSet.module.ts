import { Module } from '@nestjs/common';
import { ExercSetService } from './ExercSet.service';
import { ExercSetController } from './ExercSet.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CacheModule } from '../cache/cache.module';
import { ExercSet } from './entities/ExercSet.entity';
import { ExerciseModule } from '../exercise/exercise.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([ExercSet]),
    CacheModule.forRootFromConfig(),
    ExerciseModule,
  ],
  controllers: [ExercSetController],
  providers: [ExercSetService],
  exports: [ExercSetService],
})
export class ExercSetModule {}
