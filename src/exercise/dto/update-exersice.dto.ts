import { PartialType } from '@nestjs/swagger';
import { CreateExerciseDto } from './create-exercise.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateExerciseDto extends PartialType(CreateExerciseDto) {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Exercise ID',
  })
  id: number;
}
