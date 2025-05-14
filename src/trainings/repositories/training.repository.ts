import { EntityRepository } from '@mikro-orm/postgresql';
import { Training } from '../entities/training.entity';

export class TrainingRepository extends EntityRepository<Training> {}
