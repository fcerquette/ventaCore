import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserProfile } from '@base-template/shared';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
	constructor(private readonly users: UsersService) {}

	async profileByUid(uid: string): Promise<UserProfile> {
		const user = await this.users.findByUid(uid);
		if (!user) throw new UnauthorizedException('Usuario no encontrado');
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
			createdAt: user.createdAt.toISOString(),
			updatedAt: user.updatedAt.toISOString(),
		};
	}
}
