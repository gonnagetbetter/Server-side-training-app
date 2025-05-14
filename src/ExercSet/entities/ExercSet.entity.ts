import {
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BasicEntity } from '../../common/basic-entity';
import { ApiProperty } from '@nestjs/swagger';
import { ExercSetRepository } from '../repositories/set.repository';
import { Training } from '../../trainings/entities/training.entity';
import { Exercise } from '../../exercise/entities/exercise.entity';

@Entity({ repository: () => ExercSetRepository })
export class ExercSet extends BasicEntity {
  @PrimaryKey({ autoincrement: true })
  @ApiProperty()
  id: number;

  @Property()
  @ApiProperty()
  name: string;

  @ManyToMany(() => Exercise, (exercise) => exercise.exercSets, {
    mappedBy: 'exercSets',
  })
  @ApiProperty()
  exercises: Exercise[];

  @OneToMany(() => Training, (training) => training.ExercSetId)
  @ApiProperty()
  trainings: Training[];
}
