import { Migration } from '@mikro-orm/migrations';

export class Migration20250528132752 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "stats_report" alter column "data" type jsonb using ("data"::jsonb);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "stats_report" alter column "data" type varchar(255) using ("data"::varchar(255));');
  }

}
