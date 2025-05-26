import { Injectable } from '@nestjs/common';
import { StatsReport } from './entities/stats-report.entity';
import { BasicCrudService } from '../common/basic-crud.service';
import { CacheService } from '../cache/cache.service';
import { EntityManager } from '@mikro-orm/core';
import { StatsReportRepository } from './repositories/stats-report.repository';

@Injectable()
export class StatsReportService extends BasicCrudService<StatsReport> {
  constructor(
    protected readonly cacheService: CacheService,
    protected readonly statsReportRepository: StatsReportRepository,
    protected readonly entityManager: EntityManager,
  ) {
    super(StatsReport, statsReportRepository, cacheService, entityManager);
  }

  async createAttendanceReport(userId: number, monthsNum: number) {
    const report = new StatsReport();
    return report;
  }
}
