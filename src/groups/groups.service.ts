import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { EntityManager, FilterQuery } from '@mikro-orm/core';
import { GroupRepository } from './repositories/group.repository';
import { Group } from './entities/group.entity';
import { BasicCrudService } from '../common/basic-crud.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { FindGroupArgs } from './args/find-group.args';
import { UpdateGroupDto } from './dto/update-group.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class GroupsService extends BasicCrudService<Group> {
  constructor(
    protected readonly cacheService: CacheService,
    protected readonly groupRepository: GroupRepository,
    protected readonly entityManager: EntityManager,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {
    super(Group, groupRepository, cacheService, entityManager);
  }

  async findAll(args: FindGroupArgs) {
    const filter: FilterQuery<Group> = {};

    if (args.name) {
      filter.name = { $eq: args.name };
    }

    return this.findMany(filter);
  }

  async findOneSafe(id: number) {
    const filter: FilterQuery<Group> = { id };

    return this.findOneOrFail(filter);
  }

  async create(dto: CreateGroupDto) {
    return this.createOne({
      ...dto,
      users: [],
    });
  }

  async update(dto: UpdateGroupDto) {
    const { id } = dto;
    const filter: FilterQuery<Group> = { id };

    return this.updateOne(filter, dto);
  }

  async remove(id: number) {
    const filter: FilterQuery<Group> = { id };

    return this.deleteOne(filter);
  }

  async findAllMembers(group: Group) {
    return this.usersService.complexSearch({ group_id: group.id });
  }
}
