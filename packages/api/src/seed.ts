import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Role } from '@base-template/shared';
import { AppModule } from './app.module';
import { UsersService } from './modules/users/users.service';

/**
 * Crea el primer usuario superadmin (resuelve el huevo-y-la-gallina:
 * el alta de usuarios requiere un superadmin, pero al inicio no hay ninguno).
 *
 * Uso (desde packages/api):
 *   dotenvx run -f ../../.env.development -- ts-node -r tsconfig-paths/register src/seed.ts <email> <password>
 */
async function seed() {
	const email = process.argv[2];
	const password = process.argv[3];

	if (!email || !password) {
		// eslint-disable-next-line no-console
		console.error('Uso: ts-node src/seed.ts <email> <password>');
		process.exit(1);
	}

	const app = await NestFactory.createApplicationContext(AppModule);
	const users = app.get(UsersService);

	const existing = await users.findByEmail(email);
	if (existing) {
		// eslint-disable-next-line no-console
		console.log(`El usuario ${email} ya existe.`);
	} else {
		await users.create({ email, password, role: Role.SUPERADMIN, displayName: 'Super Admin' });
		// eslint-disable-next-line no-console
		console.log(`✅ Superadmin creado: ${email}`);
	}

	await app.close();
	process.exit(0);
}

seed();
