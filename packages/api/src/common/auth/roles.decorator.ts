import { SetMetadata } from '@nestjs/common';
import { Role } from '@base-template/shared';

export const ROLES_KEY = 'roles';

/**
 * Restringe un endpoint a uno o más roles.
 *
 *   @Roles(Role.SUPERADMIN)
 *   @Roles(Role.ADMIN, Role.SUPERADMIN)
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
