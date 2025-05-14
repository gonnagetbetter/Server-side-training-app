import { PartialType } from '@nestjs/swagger';
import { CreateExercSetDto } from '../dto/create-exerc-set.dto';

export class FindExercSetArgs extends PartialType(CreateExercSetDto) {} 