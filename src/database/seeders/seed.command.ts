import { EntityManager } from '@mikro-orm/core';
import { Seeder } from './index';
import { MikroORM } from '@mikro-orm/core';
import MikroOrmConfig from '../../mikro-orm.config';
import { Command } from 'nestjs-command';

export class SeedCommand {
  constructor(private readonly em: EntityManager) {}

  @Command({
    command: 'seed',
    describe: 'Seed the database',
  })
  async seed() {
    const orm = await MikroORM.init(MikroOrmConfig);
    const em = orm.em;

    try {
      const seeder = new Seeder(em);
      await seeder.seed();
      console.log('Seeding completed successfully!');
    } catch (error) {
      console.error('Error during seeding:', error);
    } finally {
      await orm.close();
    }
  }
} 