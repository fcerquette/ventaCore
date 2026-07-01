import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseModule } from './common/firebase/firebase.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { UserEntity } from './modules/users/entities/user.entity';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DB_HOST || 'localhost',
			port: Number(process.env.DB_PORT) || 5432,
			username: process.env.DB_USER || 'postgres',
			password: process.env.DB_PASSWORD || 'postgres',
			database: process.env.DB_NAME || 'base_template',
			entities: [UserEntity],
			synchronize: process.env.DB_SYNCHRONIZE === 'true',
		}),
		FirebaseModule,
		AuthModule,
		UsersModule,
	],
})
export class AppModule {}
