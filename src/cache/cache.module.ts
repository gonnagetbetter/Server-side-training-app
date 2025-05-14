import { DynamicModule, Module } from '@nestjs/common';
import * as Redis from 'ioredis';

import { CacheService } from './cache.service';
import { REDIS } from './cache.injections';
import { config } from '../config';

@Module({})
export class CacheModule {
  static forRoot(redisURL: string): DynamicModule {
    return {
      module: CacheModule,
      providers: [
        CacheService,
        {
          provide: REDIS,
          useFactory: () => {
            const redisUrl = new URL(redisURL);
            const options = {
              host: redisUrl.hostname,
              port: Number(redisUrl.port),
              password: redisUrl.username,
              tls: redisUrl.protocol == 'rediss:' ? {} : undefined,
              maxRetriesPerRequest: 1000,
              retryStrategy: () => 1000,
              reconnectOnError: function (err) {
                console.error(err.message);
                const targetError = 'READONLY';
                if (err.message.slice(0, targetError.length) === targetError) {
                  return 2;
                }
              },
            } as Redis.RedisOptions;

            return new Redis.Redis(options);
          },
        },
      ],
      exports: [CacheService],
      global: true,
    };
  }

  static forRootFromConfig(): DynamicModule {
    if (!config.redisUrl) {
      throw new Error('Redis URL is not configured');
    }
    return CacheModule.forRoot(config.redisUrl);
  }
}
