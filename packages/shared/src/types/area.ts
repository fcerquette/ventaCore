import { Role } from './role';

/**
 * Las 3 grandes secciones del router. Cada AreaConfig describe el rol
 * requerido y las rutas base/login del área. Es la fuente de verdad
 * compartida entre frontend (guards) y backend (autorización).
 */
export type AreaKey = 'superadmin' | 'admin' | 'app';

export interface AreaConfig {
	key: AreaKey;
	/** Rol requerido para entrar al área */
	role: Role;
	/** Prefijo de ruta del área (ej: /superadmin) */
	basePath: string;
	/** Ruta del login del área (ej: /superadmin/login) */
	loginPath: string;
	/** Ruta home por defecto luego del login */
	homePath: string;
}

export const AREAS: Record<AreaKey, AreaConfig> = {
	superadmin: {
		key: 'superadmin',
		role: Role.SUPERADMIN,
		basePath: '/superadmin',
		loginPath: '/superadmin/login',
		homePath: '/superadmin',
	},
	admin: {
		key: 'admin',
		role: Role.ADMIN,
		basePath: '/admin',
		loginPath: '/admin/login',
		homePath: '/admin',
	},
	app: {
		key: 'app',
		role: Role.USER,
		basePath: '/',
		loginPath: '/login',
		homePath: '/',
	},
};

export function areaForRole(role: Role): AreaConfig {
	return Object.values(AREAS).find(a => a.role === role) ?? AREAS.app;
}
