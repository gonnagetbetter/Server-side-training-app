import { Migration } from '@mikro-orm/migrations';

export class Migration20250513124913 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "exercise" add column "max_weight" int not null, add column "weight_increment" int not null;`);
    this.addSql(`alter table "exercise" rename column "weight" to "min_weight";`);

    this.addSql(`alter table "group" add column "name" varchar(255) not null;`);

    this.addSql(`alter table "training" add column "status" text check ("status" in ('FINISHED', 'FUTURE', 'CANCELLED')) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "exercise" drop column "max_weight", drop column "weight_increment";`);

    this.addSql(`alter table "exercise" rename column "min_weight" to "weight";`);

    this.addSql(`alter table "group" drop column "name";`);

    this.addSql(`alter table "training" drop column "status";`);
  }

}
