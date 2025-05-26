import { config as envConfig } from '../config';
import { IMonobankConfig } from './interface/monobank-config.interface';
import { MONOBANK_CONFIG } from './constants';

function assertEnvVar(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const monobankConfigProvider = {
  provide: MONOBANK_CONFIG,
  useValue: {
    apiUrl: assertEnvVar(envConfig.apiUrl, 'MONOBANK_API_URL'),
    monobankToken: assertEnvVar(envConfig.monobankToken, 'MONOBANK_TOKEN'),
    redirectUrl: assertEnvVar(envConfig.redirectUrl, 'REDIRECT_URL'),
    webhookUrl: assertEnvVar(envConfig.webhookUrl, 'WEBHOOK_URL'),
  } satisfies IMonobankConfig,
};
