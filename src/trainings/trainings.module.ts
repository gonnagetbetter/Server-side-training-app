import { Module } from '@nestjs/common';
import { TrainingsController } from './trainings.controller';
import { TrainingsService } from './trainings.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Training } from './entities/training.entity';
import { CacheModule } from '../cache/cache.module';
import { UsersModule } from '../users/users.module';
import { GroupsModule } from '../groups/groups.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Training]),
    CacheModule.forRootFromConfig(),
    UsersModule,
    GroupsModule,
  ],
  controllers: [TrainingsController],
  providers: [TrainingsService],
  exports: [TrainingsService],
})
export class TrainingsModule {}
