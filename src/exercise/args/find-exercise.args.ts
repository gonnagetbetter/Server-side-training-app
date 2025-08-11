import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class FindExerciseArgs {
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({
    required: false,
    description: 'ID of the exercise to find',
    example: 1,
    minimum: 1,
  })
  id?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Exact name of the exercise to match (case-sensitive)',
    example: 'Push-ups',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description:
      'Search term to filter exercises by name (case-insensitive partial match)',
    example: 'push',
  })
  search?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({
    required: false,
    description: 'ID of the exercise set to find exercises for',
    example: 1,
    minimum: 1,
  })
  exerciseSetId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    required: false,
    description: 'Starting weight in kilograms',
    example: 20,
  })
  startWeight?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    required: false,
    description: 'Maximum weight in kilograms',
    example: 100,
  })
  endWeight?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    required: false,
    description: 'Weight increment step in kilograms',
    example: 2.5,
  })
  weightIncrement?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({
    required: false,
    description: 'Number of sets',
    example: 3,
  })
  setsNum?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({
    required: false,
    description: 'Number of repetitions per set',
    example: 10,
  })
  repsNum?: number;
}
