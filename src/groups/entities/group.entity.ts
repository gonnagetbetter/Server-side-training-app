import {
  Entity,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BasicEntity } from '../../common/basic-entity';
import { ApiProperty } from '@nestjs/swagger';
import { GroupRepository } from '../repositories/group.repository';
import { User } from '../../users/entities/user.entity';

@Entity({ repository: () => GroupRepository })
export class Group extends BasicEntity {
  @PrimaryKey({ autoincrement: true })
  @ApiProperty()
  id: number;

  @OneToMany({ entity: () => User, mappedBy: 'group' })
  @ApiProperty()
  users: User[];

  @Property()
  @ApiProperty()
  name: string;

  @OneToOne({ entity: () => User, nullable: true })
  @ApiProperty({ type: () => User })
  creator: User;
}
