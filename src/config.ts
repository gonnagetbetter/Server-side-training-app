import { config as envConfig } from 'dotenv';

envConfig();

export const config = {
  redisUrl: process.env.REDIS_URL,
  jwtSecret: process.env.JWT_SECRET,
};
