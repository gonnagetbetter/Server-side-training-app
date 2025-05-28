import { Migration } from '@mikro-orm/migrations';

export class Migration20250527211953 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "membership" alter column "start_date" type timestamptz(0) using ("start_date"::timestamptz(0));');
    this.addSql('alter table "membership" alter column "start_date" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "membership" alter column "start_date" type timestamptz(0) using ("start_date"::timestamptz(0));');
    this.addSql('alter table "membership" alter column "start_date" set not null;');
  }

}
