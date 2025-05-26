import {
  Inject,
  Injectable,
  Logger,
  OnApplicationShutdown,
} from '@nestjs/common';
import Redis from 'ioredis';

import { REDIS } from './cache.injections';

@Injectable()
export class CacheService implements OnApplicationShutdown {
  private readonly logger: Logger = new Logger(CacheService.name);
  constructor(
    @Inject(REDIS)
    private readonly redisClient: Redis,
  ) {}

  async onApplicationShutdown(): Promise<void> {
    await this.redisClient.quit();
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const result = await this.redisClient.get(key);
      if (!result) {
        return null;
      }
      return JSON.parse(result) as T;
    } catch (error) {
      this.logger.error(`REDIS GET FAILED: ${error.message}`);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.redisClient.set(key, JSON.stringify(value), 'EX', ttl);
        return;
      }
      await this.redisClient.set(key, JSON.stringify(value));
    } catch (error) {
      this.logger.error(`REDIS SET FAILED: ${error.message}`);
    }
  }

  async wrap<T>(
    key: string,
    fn: Promise<T> | (() => T) | (() => Promise<T>),
    ttl: number,
  ): Promise<T> {
    const value = await this.get<T>(key);
    if (value) {
      return value;
    }
    const result = await (typeof fn === 'function' ? fn() : fn);
    await this.set(key, result, ttl);
    return result;
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redisClient.del(key);
    } catch (error) {
      this.logger.error(`REDIS DELETE FAILED: ${error.message}`);
    }
  }

  async deletePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redisClient.keys(pattern);

      if (!keys.length) {
        return;
      }

      await this.redisClient.del(...keys);
    } catch (error) {
      this.logger.error(`REDIS DELETE PATTERN FAILED: ${error.message}`);
    }
  }
}
