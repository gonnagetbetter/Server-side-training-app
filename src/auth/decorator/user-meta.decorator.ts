import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserMetadata } from '../types/user-metadata.type';

export const UserMeta = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return {
      userId: req.userId,
      userEmail: req.userEmail,
      userRole: req.userRole,
      userIsTrainer: req.userIsTrainer,
      userTrainerId: req.userTrainerId,
      userGroup: req.userGroup,
    } as UserMetadata;
  },
);
