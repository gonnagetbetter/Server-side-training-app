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

  @ManyToOne({ entity: () => User, inversedBy: 'statsReports', nullable: true })
  @ApiProperty({ type: () => User })
  madeFor?: User;

  @ManyToOne({ entity: () => User, inversedBy: 'statsReports' })
  @ApiProperty({ type: () => User })
  madeBy: User;

  @Property()
  @ApiProperty()
  createdAt: Date;

  @Property({ type: 'jsonb' })
  @ApiProperty()
  data: Record<string, any>;

  @Property({ nullable: true })
  @ApiProperty()
  monthsNum?: number;

  @Property({ nullable: true })
  @ApiProperty()
  startDate?: Date;

  @Property({ nullable: true })
  @ApiProperty()
  endDate?: Date;
}
