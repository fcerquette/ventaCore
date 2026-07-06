import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, UserProfile } from '@base-template/shared';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';
import { EspacioEntity } from '../spaces/entities/espacio.entity';

@Injectable()
export class AuthService {
	constructor(
		private readonly users: UsersService,
		@InjectRepository(EspacioEntity)
		private readonly espacios: Repository<EspacioEntity>,
	) {}

	async profileByUid(uid: string): Promise<UserProfile> {
		const user = await this.users.findByUid(uid);
		if (!user) throw new UnauthorizedException('Usuario no encontrado');

		// El admin de un negocio suspendido no puede entrar al panel.
		if (user.role === Role.ADMIN && user.espacioId) {
			const espacio = await this.espacios.findOne({ where: { id: user.espacioId } });
			if (espacio && !espacio.active) {
				throw new ForbiddenException({ code: 'ESPACIO_SUSPENDED', message: 'El negocio está suspendido' });
			}
		}

		return AuthService.toProfile(user);
	}

	static toProfile(user: UserEntity): UserProfile {
		return {
			id: user.id,
			uid: user.uid,
			email: user.email,
			displayName: user.displayName,
			role: user.role,
			active: user.active,
			espacioId: user.espacioId,
			createdAt: user.createdAt.toISOString(),
			updatedAt: user.updatedAt.toISOString(),
		};
	}
}
