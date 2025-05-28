import { PartialType } from '@nestjs/swagger';
import { CreateExerciseSetDto } from '../dto/create-exercise-set.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FindExerciseSetArgs extends PartialType(CreateExerciseSetDto) {
  @ApiProperty({
    description: 'Search exercise sets by name (partial match)',
    example: 'Strength',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Search exercise sets containing specific exercise IDs',
    type: [Number],
    example: [1, 2],
    required: false,
  })
  exerciseIds?: number[];
}
