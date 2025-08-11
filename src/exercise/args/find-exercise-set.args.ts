import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FindExerciseSetArgs {
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({
    required: false,
    description: 'ID of the exercise set to find',
    example: 1,
    minimum: 1,
  })
  id?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Exact name of the exercise set to match (case-sensitive)',
    example: 'Upper Body Strength',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description:
      'Search term to filter exercise sets by name (case-insensitive partial match)',
    example: 'upper',
  })
  search?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({
    required: false,
    description: 'ID of the trainer who created the exercise set',
    example: 1,
    minimum: 1,
  })
  trainerId?: number;
}
