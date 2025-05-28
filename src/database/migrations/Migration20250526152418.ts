import { Migration } from '@mikro-orm/migrations';

export class Migration20250526152418 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "membership" ("id" serial primary key, "user_id" int not null, "start_date" timestamptz(0) not null, "end_date" timestamptz(0) null, "status" text check ("status" in (\'pending\', \'active\', \'expired\', \'cancelled\')) not null, "invoice_id" varchar(255) null, "payment_url" varchar(255) null, "paid_at" timestamptz(0) null, "amount" int null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('alter table "membership" add constraint "membership_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "membership" cascade;');
  }

}
