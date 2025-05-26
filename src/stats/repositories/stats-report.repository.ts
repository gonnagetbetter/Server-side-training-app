import { EntityRepository } from '@mikro-orm/postgresql';
import { StatsReport } from '../entities/stats-report.entity';

export class StatsReportRepository extends EntityRepository<StatsReport> {}
