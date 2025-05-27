import { EntityRepository } from '@mikro-orm/postgresql';
import { Membership } from '../entity/membership.entity';

export class MembershipRepository extends EntityRepository<Membership> {}
