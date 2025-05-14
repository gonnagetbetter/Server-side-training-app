import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateExercSetDto {
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