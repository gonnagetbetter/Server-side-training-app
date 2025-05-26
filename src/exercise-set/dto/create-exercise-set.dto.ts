import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateExerciseSetDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Exercise set name',
  })
  name: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  @ApiProperty({
    description: 'Array of exercise IDs',
    type: [Number],
  })
  exerciseIds: number[];
}
