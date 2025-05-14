import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Group } from './entities/group.entity';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Group]),
    CacheModule.forRootFromConfig(),
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
