import { Migration } from '@mikro-orm/migrations';

export class Migration20250512175745 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table "exerc_set" ("id" serial primary key);`);

    this.addSql(
      `create table "exercise" ("id" serial primary key, "name" varchar(255) not null, "weight" int not null, "sets_num" int not null, "reps_num" int not null, "exerc_set_id" int not null);`,
    );

    this.addSql(`create table "group" ("id" serial primary key);`);

    this.addSql(
      `create table "training" ("id" serial primary key, "trainer_id" int null, "training_type" text check ("training_type" in ('individual', 'group')) not null, "trainee_id" int not null, "description" varchar(255) null, "date" timestamptz not null, "exerc_set_id" int not null);`,
    );

    this.addSql(
      `create table "user" ("id" serial primary key, "full_name" varchar(255) not null, "email" varchar(255) not null, "role" text check ("role" in ('USER', 'ADMIN', 'TRAINER')) not null, "password_hash" varchar(255) not null, "password_salt" varchar(255) not null, "is_trainer" boolean not null, "trainer_id_id" int null, "group_id" int null);`,
    );
    this.addSql(
      `alter table "user" add constraint "user_email_unique" unique ("email");`,
    );

    this.addSql(
      `alter table "exercise" add constraint "exercise_exerc_set_id_foreign" foreign key ("exerc_set_id") references "exerc_set" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "training" add constraint "training_exerc_set_id_foreign" foreign key ("exerc_set_id") references "exerc_set" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "user" add constraint "user_trainer_id_id_foreign" foreign key ("trainer_id_id") references "user" ("id") on update cascade on delete set null;`,
    );
    this.addSql(
      `alter table "user" add constraint "user_group_id_foreign" foreign key ("group_id") references "group" ("id") on update cascade on delete set null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "exercise" drop constraint "exercise_exerc_set_id_foreign";`,
    );

    this.addSql(
      `alter table "training" drop constraint "training_exerc_set_id_foreign";`,
    );

    this.addSql(`alter table "user" drop constraint "user_group_id_foreign";`);

    this.addSql(
      `alter table "user" drop constraint "user_trainer_id_id_foreign";`,
    );

    this.addSql(`drop table if exists "exerc_set" cascade;`);

    this.addSql(`drop table if exists "exercise" cascade;`);

    this.addSql(`drop table if exists "group" cascade;`);

    this.addSql(`drop table if exists "training" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);
  }
}
