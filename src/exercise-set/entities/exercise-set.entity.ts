import {
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BasicEntity } from '../../common/basic-entity';
import { ApiProperty } from '@nestjs/swagger';
import { Training } from '../../trainings/entities/training.entity';
import { Exercise } from '../../exercise/entities/exercise.entity';
import { ExerciseSetRepository } from '../repositories/exercise-set.repository';

@Entity({ repository: () => ExerciseSetRepository })
export class ExerciseSet extends BasicEntity {
  @PrimaryKey({ autoincrement: true })
  @ApiProperty()
  id: number;

  @Property()
  @ApiProperty()
  name: string;

  @ManyToMany(() => Exercise, (exercise) => exercise.exerciseSets, {
    mappedBy: 'exerciseSets',
  })
  @ApiProperty()
  exercises: Exercise[];

  @OneToMany(() => Training, (training) => training.ExerciseSetId)
  @ApiProperty()
  trainings: Training[];
}
