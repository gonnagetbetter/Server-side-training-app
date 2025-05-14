import { PartialType } from '@nestjs/swagger';
import { CreateExerciseDto } from '../dto/create-exercise.dto';

export class FindExerciseArgs extends PartialType(CreateExerciseDto) {}
