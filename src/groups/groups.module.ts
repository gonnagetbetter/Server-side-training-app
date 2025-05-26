import { Module, forwardRef } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Group } from './entities/group.entity';
import { CacheModule } from '../cache/cache.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Group]),
    CacheModule.forRootFromConfig(),
    forwardRef(() => UsersModule),
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
