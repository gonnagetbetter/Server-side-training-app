import { Migration } from '@mikro-orm/migrations';

export class Migration20250514145803 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "training" add column "notified_about" boolean not null;');
    this.addSql('alter table "training" alter column "date" type timestamptz(0) using ("date"::timestamptz(0));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "training" alter column "date" type timestamptz using ("date"::timestamptz);');
    this.addSql('alter table "training" drop column "notified_about";');
  }

}
