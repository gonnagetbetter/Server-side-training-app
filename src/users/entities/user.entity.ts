import { Entity, Enum, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { UserRole } from '../enums/user-role.enum';
import { BasicEntity } from '../../common/basic-entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserRepository } from '../repositories/user.repository';
import { Group } from '../../groups/entities/group.entity';
import { StatsReport } from '../../stats/entities/stats-report.entity';

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

  @ManyToOne(() => User, { nullable: true })
  @ApiProperty()
  trainer_id: number;

  @ManyToOne(() => Group, { nullable: true })
  @ApiProperty()
  group: Group;

  @OneToMany(() => StatsReport, statsReport => statsReport.madeBy)
  statsReports: StatsReport[];
}
