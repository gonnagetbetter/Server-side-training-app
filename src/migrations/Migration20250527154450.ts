import { Migration } from '@mikro-orm/migrations';

export class Migration20250527154450 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "stats_report" add column "made_for_id" int not null, add column "months_num" int null, add column "start_date" timestamptz(0) null, add column "end_date" timestamptz(0) null;');
    this.addSql('alter table "stats_report" add constraint "stats_report_made_for_id_foreign" foreign key ("made_for_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "group" add column "creator_id" int null;');
    this.addSql('alter table "group" add constraint "group_creator_id_foreign" foreign key ("creator_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "group" add constraint "group_creator_id_unique" unique ("creator_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "group" drop constraint "group_creator_id_foreign";');

    this.addSql('alter table "stats_report" drop constraint "stats_report_made_for_id_foreign";');

    this.addSql('alter table "group" drop constraint "group_creator_id_unique";');
    this.addSql('alter table "group" drop column "creator_id";');

    this.addSql('alter table "stats_report" drop column "made_for_id";');
    this.addSql('alter table "stats_report" drop column "months_num";');
    this.addSql('alter table "stats_report" drop column "start_date";');
    this.addSql('alter table "stats_report" drop column "end_date";');
  }

}
