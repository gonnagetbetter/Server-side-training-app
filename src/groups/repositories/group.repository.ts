import { EntityRepository } from '@mikro-orm/postgresql';
import { Group } from '../entities/group.entity';

export class GroupRepository extends EntityRepository<Group> {}
