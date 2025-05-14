import { EntityRepository } from '@mikro-orm/postgresql';
import { ExercSet } from '../entities/ExercSet.entity';

export class ExercSetRepository extends EntityRepository<ExercSet> {}
