import { Role } from './role';
import { UserProfile } from './user';

/** Payload que el backend adjunta al request tras verificar el ID token. */
export interface AuthenticatedUser {
	uid: string;
	email: string;
	role: Role;
	/** Espacio del admin/CM (null para superadmin). */
	espacioId?: string | null;
}

export interface MeResponse {
	user: UserProfile;
}
