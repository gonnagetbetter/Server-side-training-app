import { Migration } from '@mikro-orm/migrations';

export class Migration20250513133309 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "exercise_exerc_sets" ("exercise_id" int not null, "exerc_set_id" int not null, constraint "exercise_exerc_sets_pkey" primary key ("exercise_id", "exerc_set_id"));`);

    this.addSql(`alter table "exercise_exerc_sets" add constraint "exercise_exerc_sets_exercise_id_foreign" foreign key ("exercise_id") references "exercise" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "exercise_exerc_sets" add constraint "exercise_exerc_sets_exerc_set_id_foreign" foreign key ("exerc_set_id") references "exerc_set" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "exercise" drop constraint "exercise_exerc_set_id_foreign";`);

    this.addSql(`alter table "training" drop constraint "training_exerc_set_id_foreign";`);

    this.addSql(`alter table "exercise" drop column "exerc_set_id";`);

    this.addSql(`alter table "exerc_set" add column "name" varchar(255) not null;`);

    this.addSql(`alter table "training" rename column "exerc_set_id" to "exerc_set_id_id";`);
    this.addSql(`alter table "training" add constraint "training_exerc_set_id_id_foreign" foreign key ("exerc_set_id_id") references "exerc_set" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "exercise_exerc_sets" cascade;`);

    this.addSql(`alter table "training" drop constraint "training_exerc_set_id_id_foreign";`);

    this.addSql(`alter table "exerc_set" drop column "name";`);

    this.addSql(`alter table "exercise" add column "exerc_set_id" int not null;`);
    this.addSql(`alter table "exercise" add constraint "exercise_exerc_set_id_foreign" foreign key ("exerc_set_id") references "exerc_set" ("id") on update cascade;`);

    this.addSql(`alter table "training" rename column "exerc_set_id_id" to "exerc_set_id";`);
    this.addSql(`alter table "training" add constraint "training_exerc_set_id_foreign" foreign key ("exerc_set_id") references "exerc_set" ("id") on update cascade;`);
  }

}
