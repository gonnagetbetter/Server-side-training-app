import { Migration } from '@mikro-orm/migrations';

export class Migration20250526112752 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "exercise_exerc_sets" drop constraint "exercise_exerc_sets_exerc_set_id_foreign";',
    );

    this.addSql(
      'alter table "training" drop constraint "training_exerc_set_id_id_foreign";',
    );

    this.addSql(
      'create table "exercise_set" ("id" serial primary key, "name" varchar(255) not null);',
    );

    this.addSql(
      'create table "exercise_exercise_sets" ("exercise_id" int not null, "exercise_set_id" int not null, constraint "exercise_exercise_sets_pkey" primary key ("exercise_id", "exercise_set_id"));',
    );

    this.addSql(
      'create table "stats_report" ("id" serial primary key, "made_by_id" int not null, "created_at" timestamptz(0) not null, "data" varchar(255) not null);',
    );

    this.addSql(
      'alter table "exercise_exercise_sets" add constraint "exercise_exercise_sets_exercise_id_foreign" foreign key ("exercise_id") references "exercise" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "exercise_exercise_sets" add constraint "exercise_exercise_sets_exercise_set_id_foreign" foreign key ("exercise_set_id") references "exercise_set" ("id") on update cascade on delete cascade;',
    );

    this.addSql(
      'alter table "stats_report" add constraint "stats_report_made_by_id_foreign" foreign key ("made_by_id") references "user" ("id") on update cascade;',
    );

    this.addSql('drop table if exists "exerc_set" cascade;');

    this.addSql('drop table if exists "exercise_exerc_sets" cascade;');

    this.addSql(
      'alter table "user" add column "created_at" timestamptz(0) not null;',
    );

    this.addSql(
      'alter table "training" rename column "exerc_set_id_id" to "exercise_set_id_id";',
    );
    this.addSql(
      'alter table "training" add constraint "training_exercise_set_id_id_foreign" foreign key ("exercise_set_id_id") references "exercise_set" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "exercise_exercise_sets" drop constraint "exercise_exercise_sets_exercise_set_id_foreign";',
    );

    this.addSql(
      'alter table "training" drop constraint "training_exercise_set_id_id_foreign";',
    );

    this.addSql(
      'create table "exerc_set" ("id" serial primary key, "name" varchar(255) not null);',
    );

    this.addSql(
      'create table "exercise_exerc_sets" ("exercise_id" int not null, "exerc_set_id" int not null, constraint "exercise_exerc_sets_pkey" primary key ("exercise_id", "exerc_set_id"));',
    );

    this.addSql(
      'alter table "exercise_exerc_sets" add constraint "exercise_exerc_sets_exercise_id_foreign" foreign key ("exercise_id") references "exercise" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "exercise_exerc_sets" add constraint "exercise_exerc_sets_exerc_set_id_foreign" foreign key ("exerc_set_id") references "exerc_set" ("id") on update cascade on delete cascade;',
    );

    this.addSql('drop table if exists "exercise_set" cascade;');

    this.addSql('drop table if exists "exercise_exercise_sets" cascade;');

    this.addSql('drop table if exists "stats_report" cascade;');

    this.addSql('alter table "user" drop column "created_at";');

    this.addSql(
      'alter table "training" rename column "exercise_set_id_id" to "exerc_set_id_id";',
    );
    this.addSql(
      'alter table "training" add constraint "training_exerc_set_id_id_foreign" foreign key ("exerc_set_id_id") references "exerc_set" ("id") on update cascade;',
    );
  }
}
