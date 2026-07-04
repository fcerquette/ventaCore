import { Body, Controller, ForbiddenException, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, Role } from '@base-template/shared';
import { FirebaseAuthGuard } from '../../common/auth/firebase-auth.guard';
import { RolesGuard } from '../../common/auth/roles.guard';
import { Roles } from '../../common/auth/roles.decorator';
import { CurrentUser } from '../../common/auth/current-user.decorator';
import { EspaciosService } from './espacios.service';
import { UpdateAboutDto } from './dto/update-about.dto';

/** El admin (CM) consulta y edita la página "Sobre Nosotros" de SU espacio. */
@ApiTags('mi-espacio')
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('mi-espacio')
export class MiEspacioController {
	constructor(private readonly espacios: EspaciosService) {}

	@Get()
	find(@CurrentUser() user: AuthenticatedUser) {
		return this.espacios.findById(espacioDe(user));
	}

	@Patch()
	updateAbout(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateAboutDto) {
		return this.espacios.updateAbout(espacioDe(user), dto);
	}
}

function espacioDe(user: AuthenticatedUser): string {
	if (!user.espacioId) throw new ForbiddenException('El usuario no tiene un espacio asignado');
	return user.espacioId;
}
