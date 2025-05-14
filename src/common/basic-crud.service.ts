import { BasicEntity } from './basic-entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { CacheService } from '../cache/cache.service';
import {
  EntityManager,
  FilterQuery,
  FindOptions,
  RequiredEntityData,
  EntityData,
  FindOneOptions,
  FindOneOrFailOptions,
} from '@mikro-orm/core';
import { ThroughCache } from '../cache/decorators/through-cache.decorator';
import { NotFoundException } from '@nestjs/common';

export class BasicCrudService<T extends BasicEntity> {
  constructor(
    protected readonly entityClass: new () => T,
    protected readonly entityRepository: EntityRepository<T>,
    protected readonly cacheService: CacheService,
    protected readonly entityManager: EntityManager,
  ) {}

  async findOne(args: FilterQuery<T>, options?: FindOneOptions<T>): Promise<T | null> {
    return await this.entityRepository.findOne(args, options);
  }

  async findOneOrFail(
    args: FilterQuery<T>,
    options?: FindOneOrFailOptions<T>,
  ): Promise<T> {
    try {
      return await this.entityRepository.findOneOrFail(args, options);
    } catch {
      throw new NotFoundException(`${this.entityClass.name} not found`);
    }
  }

  @ThroughCache(60)
  async findOneCached(
    args: FilterQuery<T>,
    options?: FindOneOptions<T>,
  ): Promise<T | null> {
    return await this.findOne(args, options);
  }

  async findMany(
    args: FilterQuery<T>,
    options?: FindOptions<T>,
  ): Promise<T[]> {
    return await this.entityRepository.find(args, options);
  }

  @ThroughCache(60)
  async findManyCached(
    args: FilterQuery<T>,
    options?: FindOptions<T>,
  ): Promise<T[]> {
    return await this.findMany(args, options);
  }

  async upsert(entity: RequiredEntityData<T>): Promise<T | null> {
    const newEntity = this.entityRepository.create(entity);

    await Promise.all([
      this.flushCrudCache(),
      this.entityManager.upsert(newEntity),
    ]);
    return await this.findOne(newEntity as FilterQuery<T>);
  }

  async createOne(data: RequiredEntityData<T>): Promise<T | null> {
    const entity = this.entityRepository.create(data);

    await Promise.all([
      this.flushCrudCache(),
      this.entityManager.persistAndFlush(entity as T),
    ]);

    return await this.findOne(entity as FilterQuery<T>);
  }

  async updateOne(
    args: FilterQuery<T>,
    data: EntityData<T>,
  ): Promise<T | null> {
    const entity = await this.findOne(args);

    if (!entity) {
      throw new NotFoundException(
        `No ${this.entityClass.name} found to update`,
      );
    }

    await Promise.all([
      this.flushCrudCache(),
      this.entityRepository.nativeUpdate(args, data),
    ]);

    return await this.findOne(entity);
  }

  async deleteOne(args: FilterQuery<T>): Promise<T | null> {
    const entity = await this.findOne(args);

    if (!entity) {
      throw new NotFoundException(
        `No ${this.entityClass.name} found to delete`,
      );
    }

    await Promise.all([
      this.flushCrudCache(),
      this.entityManager.remove(entity).flush(),
    ]);

    return entity;
  }

  async flushCrudCache(): Promise<void> {
    return await this.cacheService.deletePattern(`${this.constructor.name}:*`);
  }
}
