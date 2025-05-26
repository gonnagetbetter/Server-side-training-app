import { PartialType } from '@nestjs/swagger';
import { CreateExerciseSetDto } from './create-exercise-set.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class UpdateExerciseSetDto extends PartialType(CreateExerciseSetDto) {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Exercise set ID',
  })
  id: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty({
    description: 'Array of exercise IDs',
    type: [Number],
    required: false,
  })
  exerciseIds?: number[];
}
