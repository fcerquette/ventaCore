import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { UsersService } from '../../modules/users/users.service';

/**
 * Verifica el Bearer ID token de Firebase, carga el perfil del usuario
 * (con su rol) desde la base, y lo adjunta a `request.user`.
 */
@Injectable()
export class FirebaseAuthGuard implements CanActivate {
	constructor(
		private readonly firebase: FirebaseService,
		private readonly users: UsersService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const header: string | undefined = request.headers?.authorization;

		if (!header || !header.startsWith('Bearer ')) {
			throw new UnauthorizedException('Falta el token de autenticación');
		}

		const idToken = header.slice('Bearer '.length).trim();

		let decoded;
		try {
			decoded = await this.firebase.verifyIdToken(idToken);
		} catch {
			throw new UnauthorizedException('Token inválido o expirado');
		}

		const profile = await this.users.findByUid(decoded.uid);
		if (!profile || !profile.active) {
			throw new UnauthorizedException('Usuario no habilitado');
		}

		request.user = {
			uid: profile.uid,
			email: profile.email,
			role: profile.role,
			espacioId: profile.espacioId,
		};

		return true;
	}
}
