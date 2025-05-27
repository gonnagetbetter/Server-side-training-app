import {
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  ManyToMany,
} from '@mikro-orm/core';
import { UserRole } from '../enums/user-role.enum';
import { BasicEntity } from '../../common/basic-entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserRepository } from '../repositories/user.repository';
import { Group } from '../../groups/entities/group.entity';
import { StatsReport } from '../../stats/entities/stats-report.entity';
import { Training } from '../../trainings/entities/training.entity';

@Entity({ repository: () => UserRepository })
export class User extends BasicEntity {
  @PrimaryKey({ autoincrement: true })
  @ApiProperty()
  id: number;

  @Property()
  @ApiProperty()
  fullName: string;

  @Property({ unique: true })
  @ApiProperty()
  email: string;

  @Enum(() => UserRole)
  @ApiProperty({
    enum: UserRole,
  })
  role: UserRole;

  @Property({ hidden: true })
  passwordHash: string;

  @Property({ hidden: true })
  passwordSalt: string;

  @Property({ onCreate: () => new Date() })
  @ApiProperty()
  createdAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @ApiProperty({ type: () => User })
  trainerId: number;

  @ManyToOne(() => Group, { nullable: true })
  @ApiProperty({ type: () => Group })
  group: Group;

  @OneToMany(() => StatsReport, (statsReport) => statsReport.madeBy)
  @ApiProperty({ type: () => [StatsReport] })
  statsReports: StatsReport[];

  @ManyToMany(() => Training, (training) => training.absentUsers, {
    mappedBy: 'absentUsers',
  })
  @ApiProperty({ type: () => [Training] })
  absentOnTrainings: Training[];
}
