import { Migration } from '@mikro-orm/migrations';

export class Migration20250528105512 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_trainer_id_id_foreign";');

    this.addSql('alter table "training" drop constraint if exists "training_training_type_check";');

    this.addSql('alter table "user" rename column "trainer_id_id" to "trainer_id";');
    this.addSql('alter table "user" add constraint "user_trainer_id_foreign" foreign key ("trainer_id") references "user" ("id") on update cascade on delete set null;');

    this.addSql('alter table "training" alter column "training_type" type text using ("training_type"::text);');
    this.addSql('alter table "training" add constraint "training_training_type_check" check ("training_type" in (\'INDIVIDUAL\', \'GROUP\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_trainer_id_foreign";');

    this.addSql('alter table "training" drop constraint if exists "training_training_type_check";');

    this.addSql('alter table "user" rename column "trainer_id" to "trainer_id_id";');
    this.addSql('alter table "user" add constraint "user_trainer_id_id_foreign" foreign key ("trainer_id_id") references "user" ("id") on update cascade on delete set null;');

    this.addSql('alter table "training" alter column "training_type" type text using ("training_type"::text);');
    this.addSql('alter table "training" add constraint "training_training_type_check" check ("training_type" in (\'individual\', \'group\'));');
  }

}
