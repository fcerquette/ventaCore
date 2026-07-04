import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { UserEntity } from '../users/entities/user.entity';
import { RubroEntity } from '../catalog/entities/rubro.entity';
import { FirebaseAuthGuard } from '../../common/auth/firebase-auth.guard';
import { RolesGuard } from '../../common/auth/roles.guard';
import { EspacioEntity } from './entities/espacio.entity';
import { EspaciosService } from './espacios.service';
import { EspaciosController } from './espacios.controller';
import { MiEspacioController } from './mi-espacio.controller';

@Module({
	imports: [TypeOrmModule.forFeature([EspacioEntity, UserEntity, RubroEntity]), UsersModule],
	controllers: [EspaciosController, MiEspacioController],
	providers: [EspaciosService, FirebaseAuthGuard, RolesGuard],
	exports: [EspaciosService],
})
export class SpacesModule {}
