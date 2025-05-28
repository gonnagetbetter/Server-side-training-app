import { PartialType } from '@nestjs/swagger';
import { CreateExerciseDto } from './create-exercise.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateExerciseDto extends PartialType(CreateExerciseDto) {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID of the exercise to update',
    example: 1,
    required: true,
  })
  id: number;
} 