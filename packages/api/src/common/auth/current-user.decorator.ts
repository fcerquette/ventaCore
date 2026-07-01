import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from '@base-template/shared';

/** Inyecta el usuario autenticado (seteado por FirebaseAuthGuard). */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
	const request = ctx.switchToHttp().getRequest();
	return request.user;
});
