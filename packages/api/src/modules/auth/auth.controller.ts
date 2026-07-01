import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, MeResponse } from '@base-template/shared';
import { FirebaseAuthGuard } from '../../common/auth/firebase-auth.guard';
import { CurrentUser } from '../../common/auth/current-user.decorator';
import { AuthService } from './auth.service';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
	constructor(private readonly auth: AuthService) {}

	/**
	 * Devuelve el perfil del usuario autenticado (incluye su rol).
	 * El frontend lo usa tras el login para decidir a qué área entra.
	 */
	@Get('me')
	@UseGuards(FirebaseAuthGuard)
	async me(@CurrentUser() user: AuthenticatedUser): Promise<MeResponse> {
		return { user: await this.auth.profileByUid(user.uid) };
	}
}
