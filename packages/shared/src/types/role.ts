/**
 * Roles del sistema. Cada uno mapea a un área del router con su propio login.
 *
 *  - superadmin → /superadmin
 *  - admin      → /admin
 *  - user       → /app
 */
export enum Role {
	SUPERADMIN = 'superadmin',
	ADMIN = 'admin',
	USER = 'user',
}

export const ALL_ROLES: Role[] = [Role.SUPERADMIN, Role.ADMIN, Role.USER];

export function isRole(value: unknown): value is Role {
	return typeof value === 'string' && ALL_ROLES.includes(value as Role);
}
