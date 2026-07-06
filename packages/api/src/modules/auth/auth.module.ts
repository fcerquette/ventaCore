import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EspacioEntity } from '../spaces/entities/espacio.entity';
import { FirebaseAuthGuard } from '../../common/auth/firebase-auth.guard';
import { RolesGuard } from '../../common/auth/roles.guard';

@Module({
	imports: [UsersModule, TypeOrmModule.forFeature([EspacioEntity])],
	controllers: [AuthController],
	providers: [AuthService, FirebaseAuthGuard, RolesGuard],
	exports: [AuthService],
})
export class AuthModule {}
