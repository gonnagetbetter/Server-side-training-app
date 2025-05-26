import { BasicEntity } from '../../common/basic-entity';
import {
  Entity,
  PrimaryKey,
  Property,
  Enum,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from '@mikro-orm/core';
import { TrainingRepository } from '../repositories/training.repository';
import { ApiProperty } from '@nestjs/swagger';
import { TrainingType } from '../enums/training-type.enum';
import { TrainingStatus } from '../enums/training-status';
import { User } from '../../users/entities/user.entity';
import { Group } from '../../groups/entities/group.entity';
import { ExerciseSet } from '../../exercise-set/entities/exercise-set.entity';

@Entity({ repository: () => TrainingRepository })
export class Training extends BasicEntity {
  @PrimaryKey({ autoincrement: true })
  @ApiProperty()
  id: number;

  @ManyToOne(() => User, { nullable: true })
  @ApiProperty({ type: () => User })
  trainer: null | User;

  @Enum(() => TrainingType)
  @ApiProperty({ enum: TrainingType })
  trainingType: TrainingType;

  @ManyToOne(() => User, { nullable: true })
  @ApiProperty({ type: () => User })
  trainee: User;

  @ManyToOne(() => Group, { nullable: true })
  @ApiProperty({ type: () => Group })
  traineeGroup: Group;

  @ManyToMany(() => User)
  @ApiProperty({ type: () => [User] })
  absentUsers: User[];

  @Property({ nullable: true })
  @ApiProperty()
  description: string;

  @Property()
  @ApiProperty()
  date: Date;

  @Enum(() => TrainingStatus)
  @ApiProperty({ enum: TrainingStatus })
  status: TrainingStatus;

  @Property()
  @ApiProperty()
  NotifiedAbout: boolean;

  @ManyToOne({ entity: () => ExerciseSet })
  @ApiProperty({ type: () => ExerciseSet })
  ExerciseSetId: number;
}
