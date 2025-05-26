import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { MonobankModule } from '../monobank/monobank.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Membership } from './entity/membership.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Membership]),
    MonobankModule,
    UsersModule,
  ],
  controllers: [MembershipController],
  providers: [MembershipService],
})
export class MembershipModule {}
