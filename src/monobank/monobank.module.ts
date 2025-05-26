import { Module } from '@nestjs/common';
import { MonobankClient } from './monobank-client';
import { monobankConfigProvider } from './monobank-config.provider';

@Module({
  providers: [MonobankClient, monobankConfigProvider],
  exports: [MonobankClient, monobankConfigProvider],
})
export class MonobankModule {}
