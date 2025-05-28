import { Migration } from '@mikro-orm/migrations';

export class Migration20250528134258 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "stats_report" drop constraint "stats_report_made_for_id_foreign";');

    this.addSql('alter table "stats_report" alter column "made_for_id" type int using ("made_for_id"::int);');
    this.addSql('alter table "stats_report" alter column "made_for_id" drop not null;');
    this.addSql('alter table "stats_report" add constraint "stats_report_made_for_id_foreign" foreign key ("made_for_id") references "user" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "stats_report" drop constraint "stats_report_made_for_id_foreign";');

    this.addSql('alter table "stats_report" alter column "made_for_id" type int using ("made_for_id"::int);');
    this.addSql('alter table "stats_report" alter column "made_for_id" set not null;');
    this.addSql('alter table "stats_report" add constraint "stats_report_made_for_id_foreign" foreign key ("made_for_id") references "user" ("id") on update cascade;');
  }

}
