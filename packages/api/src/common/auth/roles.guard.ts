import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@base-template/shared';
import { ROLES_KEY } from './roles.decorator';

/**
 * Debe usarse SIEMPRE después de FirebaseAuthGuard.
 * Lee los roles requeridos del decorador @Roles() y los compara
 * contra request.user.role.
 */
@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (!requiredRoles || requiredRoles.length === 0) {
			return true;
		}

		const { user } = context.switchToHttp().getRequest();
		if (!user || !requiredRoles.includes(user.role)) {
			throw new ForbiddenException('No tenés permiso para esta acción');
		}

		return true;
	}
}
