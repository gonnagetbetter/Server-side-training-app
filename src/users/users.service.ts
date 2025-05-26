import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BasicCrudService } from '../common/basic-crud.service';
import { User } from './entities/user.entity';
import { CacheService } from '../cache/cache.service';
import { UserRepository } from './repositories/user.repository';
import { EntityManager, FilterQuery } from '@mikro-orm/core';
import { plainToInstance } from 'class-transformer';
import { FindUserArgs } from './args/find-user.args';
import { UpdateUserDto } from './dto/update-user.dto';
import { GroupsService } from '../groups/groups.service';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class UsersService extends BasicCrudService<User> {
  constructor(
    protected readonly cacheService: CacheService,
    protected readonly userRepository: UserRepository,
    protected readonly entityManager: EntityManager,
    private readonly groupsService: GroupsService,
  ) {
    super(User, userRepository, cacheService, entityManager);
  }

  async findOneByIdSafe(id: number): Promise<Partial<User>> {
    const result = await this.findOne({ id });

    if (!result) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return result.toSafeEntity();
  }

  async complexSearch(args: FindUserArgs): Promise<Partial<User>[]> {
    const query = this.userRepository.qb().select('*');

    if (args.id) {
      query.andWhere({ id: args.id });
    }

    if (args.email) {
      query.andWhere({ email: args.email });
    }

    if (args.fullName) {
      query.andWhere({ fullName: args.fullName });
    }

    if (args.role) {
      query.andWhere({ role: args.role });
    }

    if (args.trainer_id) {
      query.andWhere({ trainer_id: args.trainer_id });
    }

    if (args.search) {
      query.andWhere({
        $or: [
          { email: { $like: `%${args.search}%` } },
          { fullName: { $like: `%${args.search}%` } },
        ],
      });
    }

    const result = await query.execute();

    return result.map((user) => plainToInstance(User, user).toSafeEntity());
  }

  async update(dto: UpdateUserDto) {
    const filter: FilterQuery<User> = { id: dto.id };
    const updateData: Partial<User> = {};

    const user = await this.findOne(filter);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.email) {
      updateData.email = dto.email;
    }

    if (dto.role) {
      updateData.role = dto.role as UserRole;
    }

    if (dto.trainer_id) {
      const trainer = await this.findOne({ id: dto.trainer_id });
      if (!trainer) {
        throw new NotFoundException('Trainer not found');
      }
      if (trainer.role !== UserRole.TRAINER) {
        throw new BadRequestException('Specified user is not a trainer');
      }
      updateData.trainer_id = dto.trainer_id;
    }

    if (dto.group_id) {
      const group = await this.groupsService.findOne({ id: dto.group_id });
      if (!group) {
        throw new NotFoundException('Group not found');
      }
      updateData.group = group;
    }

    if (dto.name) {
      updateData.fullName = dto.name;
    }

    return this.updateOne(filter, updateData);
  }
}
