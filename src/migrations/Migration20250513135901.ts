import { Migration } from '@mikro-orm/migrations';

export class Migration20250513135901 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "training" add column "trainee_group_id" int null;`,
    );
    this.addSql(
      `alter table "training" alter column "trainee_id" type int using ("trainee_id"::int);`,
    );
    this.addSql(
      `alter table "training" alter column "trainee_id" drop not null;`,
    );
    this.addSql(
      `alter table "training" add constraint "training_trainee_group_id_foreign" foreign key ("trainee_group_id") references "group" ("id") on update cascade on delete set null;`,
    );
    this.addSql(
      `alter table "training" add constraint "training_trainer_id_foreign" foreign key ("trainer_id") references "user" ("id") on update cascade on delete set null;`,
    );
    this.addSql(
      `alter table "training" add constraint "training_trainee_id_foreign" foreign key ("trainee_id") references "user" ("id") on update cascade on delete set null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "training" drop constraint "training_trainer_id_foreign";`,
    );
    this.addSql(
      `alter table "training" drop constraint "training_trainee_id_foreign";`,
    );
    this.addSql(
      `alter table "training" drop constraint "training_trainee_group_id_foreign";`,
    );

    this.addSql(`alter table "training" drop column "trainee_group_id";`);

    this.addSql(
      `alter table "training" alter column "trainee_id" type int using ("trainee_id"::int);`,
    );
    this.addSql(
      `alter table "training" alter column "trainee_id" set not null;`,
    );
  }
}
