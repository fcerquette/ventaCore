import { Role } from './role';
import { UserProfile } from './user';

/** Payload que el backend adjunta al request tras verificar el ID token. */
export interface AuthenticatedUser {
	uid: string;
	email: string;
	role: Role;
}

export interface MeResponse {
	user: UserProfile;
}
