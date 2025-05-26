import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsReportService } from './stats.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CacheModule } from '../cache/cache.module';
import { StatsReport } from './entities/stats-report.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([StatsReport]),
    CacheModule.forRootFromConfig(),
  ],
  controllers: [StatsController],
  providers: [StatsReportService],
  exports: [StatsReportService],
})
export class StatsModule {}
