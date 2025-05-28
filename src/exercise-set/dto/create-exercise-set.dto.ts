import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateExerciseSetDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the exercise set/program',
    example: 'Upper Body Strength Program',
    required: true,
  })
  name: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  @ApiProperty({
    description: 'Array of exercise IDs that are part of this set',
    type: [Number],
    example: [1, 2, 3, 4],
    required: true,
  })
  exerciseIds: number[];
}
