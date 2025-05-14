import { Migration } from '@mikro-orm/migrations';

export class Migration20250513172145 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "exercise" drop column "min_weight", drop column "max_weight";`);

    this.addSql(`alter table "exercise" add column "start_weight" int not null, add column "end_weight" int not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "exercise" drop column "start_weight", drop column "end_weight";`);

    this.addSql(`alter table "exercise" add column "min_weight" int not null, add column "max_weight" int not null;`);
  }

}
