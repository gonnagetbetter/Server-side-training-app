import { config as envConfig } from 'dotenv';

envConfig();

export const config = {
  redisUrl: process.env.REDIS_URL,
  jwtSecret: process.env.JWT_SECRET,
  apiUrl: process.env.MONOBANK_API_URL,
  redirectUrl: process.env.REDIRECT_URL,
  webhookUrl: `${process.env.BASE_API_URL}/membership/callback-mono`,
  monobankToken: process.env.MONOBANK_TOKEN,
};
