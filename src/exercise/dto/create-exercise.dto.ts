import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateExerciseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Exercise name',
  })
  name: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Minimum weight',
  })
  startWeight: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Maximum weight',
  })
  endWeight: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Weight increment step',
  })
  weightIncrement: number;

  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Number of sets',
  })
  setsNum: number;

  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Number of repetitions',
  })
  repsNum: number;
}
