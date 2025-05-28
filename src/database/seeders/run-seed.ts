import { MikroORM } from '@mikro-orm/core';
import { Seeder } from './index';
import MikroOrmConfig from '../../mikro-orm.config';

async function runSeed() {
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

runSeed(); 