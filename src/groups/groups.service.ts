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
import { UserMetadata } from '../auth/types/user-metadata.type';

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

  async create(dto: CreateGroupDto, creatorId: number) {
    const creator = await this.usersService.findOne(creatorId);
    if (!creator) {
      throw new Error(`User with id ${creatorId} not found`);
    }
    return this.createOne({
      ...dto,
      users: [],
      creator: creator,
    });
  }

  async update(dto: UpdateGroupDto, meta: UserMetadata) {
    const group = await this.findOneSafe(dto.id);
    if (meta.userRole == 'ADMIN' || group.creator.id == meta.userId) {
      const { id } = dto;
      const filter: FilterQuery<Group> = { id };

      return this.updateOne(filter, dto);
    }
    throw new Error('You are not allowed to update this group');
  }

  async remove(id: number, meta: UserMetadata) {
    const group = await this.findOneSafe(id);
    if (meta.userRole == 'ADMIN' || group.creator.id == meta.userId) {
      const filter: FilterQuery<Group> = { id };

      return this.deleteOne(filter);
    }
    throw new Error('You are not allowed to delete this group');
  }

  async findAllMembers(group: Group) {
    return this.usersService.complexSearch({ group_id: group.id });
  }
}
