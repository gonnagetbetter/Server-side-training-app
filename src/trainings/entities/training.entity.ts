import { BasicEntity } from '../../common/basic-entity';
import { Entity, PrimaryKey, Property, Enum, ManyToOne } from '@mikro-orm/core';
import { TrainingRepository } from '../repositories/training.repository';
import { ApiProperty } from '@nestjs/swagger';
import { TrainingType } from '../enums/training-type.enum';
import { TrainingStatus } from '../enums/training-status';
import { ExercSet } from '../../ExercSet/entities/ExercSet.entity';
import { User } from '../../users/entities/user.entity';
import { Group } from '../../groups/entities/group.entity';

@Entity({ repository: () => TrainingRepository })
export class Training extends BasicEntity {
  @PrimaryKey({ autoincrement: true })
  @ApiProperty()
  id: number;

  @ManyToOne(() => User, { nullable: true })
  @ApiProperty()
  trainer: null | User;

  @Enum(() => TrainingType)
  @ApiProperty({ enum: TrainingType })
  trainingType: TrainingType;

  @ManyToOne(() => User, { nullable: true })
  @ApiProperty()
  trainee: User;

  @ManyToOne(() => Group, { nullable: true })
  @ApiProperty()
  traineeGroup: Group;

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

  @ManyToOne({ entity: () => ExercSet })
  @ApiProperty()
  ExercSetId: number;
}
