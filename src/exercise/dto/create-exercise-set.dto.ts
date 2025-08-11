import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateExerciseSetDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'Name of the exercise set (e.g., "Upper Body Strength", "Core Workout", "Full Body Circuit")',
    example: 'Upper Body Strength',
    required: true,
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'Detailed description of the exercise set, including its purpose and target muscle groups',
    example:
      'A comprehensive upper body workout focusing on chest, shoulders, and arms. Includes both compound and isolation exercises.',
    required: true,
  })
  description: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID of the trainer who created this exercise set',
    example: 1,
    required: true,
  })
  trainerId: number;
}
