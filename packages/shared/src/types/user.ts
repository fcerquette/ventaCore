import { Role } from './role';

export interface UserProfile {
	id: string;
	/** UID de Firebase Auth */
	uid: string;
	email: string;
	displayName: string | null;
	role: Role;
	active: boolean;
	/** Espacio (negocio) al que pertenece el admin/CM. null para superadmin. */
	espacioId: string | null;
	createdAt: string;
	updatedAt: string;
}
