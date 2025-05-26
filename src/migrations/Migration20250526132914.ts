import { Migration } from '@mikro-orm/migrations';

export class Migration20250526132914 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "training_absent_users" ("training_id" int not null, "user_id" int not null, constraint "training_absent_users_pkey" primary key ("training_id", "user_id"));');

    this.addSql('alter table "training_absent_users" add constraint "training_absent_users_training_id_foreign" foreign key ("training_id") references "training" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "training_absent_users" add constraint "training_absent_users_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "training_absent_users" cascade;');
  }

}
