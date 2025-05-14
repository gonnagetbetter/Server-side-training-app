import { Entity, ManyToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { ExerciseRepository } from '../repositories/exercise.repository';
import { BasicEntity } from '../../common/basic-entity';
import { ApiProperty } from '@nestjs/swagger';
import { ExercSet } from '../../ExercSet/entities/ExercSet.entity';

@Entity({ repository: () => ExerciseRepository })
export class Exercise extends BasicEntity {
  @PrimaryKey({ autoincrement: true })
  @ApiProperty()
  id: number;

  @Property()
  @ApiProperty()
  name: string;

  @Property()
  @ApiProperty()
  startWeight: number;

  @Property()
  @ApiProperty()
  endWeight: number;

  @Property()
  @ApiProperty()
  weightIncrement: number;

  @Property()
  @ApiProperty()
  setsNum: number;

  @Property()
  @ApiProperty()
  repsNum: number;

  @ManyToMany(() => ExercSet)
  @ApiProperty()
  exercSets: ExercSet[];
}
