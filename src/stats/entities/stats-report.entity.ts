import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { StatsReportRepository } from '../repositories/stats-report.repository';
import { BasicEntity } from '../../common/basic-entity';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ repository: () => StatsReportRepository })
export class StatsReport extends BasicEntity {
  @PrimaryKey({ autoincrement: true })
  @ApiProperty()
  id: number;

  @ManyToOne({ entity: () => User, inversedBy: 'statsReports' })
  @ApiProperty({ type: () => User })
  madeBy: User;

  @Property()
  @ApiProperty()
  createdAt: Date;

  @Property()
  @ApiProperty()
  data: Record<string, any>;
}
