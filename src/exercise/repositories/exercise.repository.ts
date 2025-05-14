import { EntityRepository } from '@mikro-orm/postgresql';
import { Exercise } from '../entities/exercise.entity';

export class ExerciseRepository extends EntityRepository<Exercise> {}
