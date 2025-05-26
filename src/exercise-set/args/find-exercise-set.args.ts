import { PartialType } from '@nestjs/swagger';
import { CreateExerciseSetDto } from '../dto/create-exercise-set.dto';

export class FindExerciseSetArgs extends PartialType(CreateExerciseSetDto) {}
