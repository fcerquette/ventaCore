import { Role } from './role';

export interface UserProfile {
	id: string;
	/** UID de Firebase Auth */
	uid: string;
	email: string;
	displayName: string | null;
	role: Role;
	active: boolean;
	createdAt: string;
	updatedAt: string;
}
