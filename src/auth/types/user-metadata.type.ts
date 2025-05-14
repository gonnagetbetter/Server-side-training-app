import { UserRole } from '../../users/enums/user-role.enum';

export type UserMetadata = {
  userId: number;
  userEmail: string;
  userRole: UserRole;
};
