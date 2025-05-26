import { EntityRepository } from '@mikro-orm/postgresql';
import { ExerciseSet } from '../entities/exercise-set.entity';

export class ExerciseSetRepository extends EntityRepository<ExerciseSet> {}
