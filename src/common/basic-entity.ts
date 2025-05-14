import { wrap, EntityDTO } from '@mikro-orm/core';

export class BasicEntity {
  toSafeEntity(
    ignoreFields: (keyof this)[] = [],
  ): Omit<EntityDTO<this>, keyof this> {
    return wrap(this).toObject(ignoreFields as string[]);
  }
}
