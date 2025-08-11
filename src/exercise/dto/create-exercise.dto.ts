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
    description:
      'Name of the exercise (e.g., "Push-ups", "Squats", "Bench Press")',
    example: 'Push-ups',
    required: true,
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'Detailed description of how to perform the exercise correctly, including form and technique',
    example:
      'Start in a plank position with hands shoulder-width apart. Lower your body until your chest nearly touches the floor, then push back up.',
    required: true,
  })
  description: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID of the exercise set this exercise belongs to',
    example: 1,
    required: true,
  })
  exerciseSetId: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Starting weight for the exercise in kilograms',
    example: 20,
    required: true,
  })
  startWeight: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Maximum weight for the exercise in kilograms',
    example: 100,
    required: true,
  })
  endWeight: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Weight increment step in kilograms for progression',
    example: 2.5,
    required: true,
  })
  weightIncrement: number;

  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Number of sets to perform for this exercise',
    example: 3,
    required: true,
  })
  setsNum: number;

  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Number of repetitions to perform in each set',
    example: 10,
    required: true,
  })
  repsNum: number;
}
