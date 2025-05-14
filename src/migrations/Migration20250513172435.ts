import { Migration } from '@mikro-orm/migrations';

export class Migration20250513172435 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" drop column "is_trainer";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" add column "is_trainer" boolean not null;`);
  }

}
