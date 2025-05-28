import { PartialType } from '@nestjs/swagger';
import { CreateExerciseSetDto } from './create-exercise-set.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateExerciseSetDto extends PartialType(CreateExerciseSetDto) {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID of the exercise set to update',
    example: 1,
    required: true,
  })
  id: number;
} 