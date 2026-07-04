import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@base-template/shared';
import { FirebaseAuthGuard } from '../../common/auth/firebase-auth.guard';
import { RolesGuard } from '../../common/auth/roles.guard';
import { Roles } from '../../common/auth/roles.decorator';
import { EspaciosService } from './espacios.service';
import { CreateEspacioDto } from './dto/create-espacio.dto';
import { UpdateEspacioDto } from './dto/update-espacio.dto';

@ApiTags('espacios')
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard, RolesGuard)
@Roles(Role.SUPERADMIN)
@Controller('espacios')
export class EspaciosController {
	constructor(private readonly espacios: EspaciosService) {}

	@Get()
	findAll() {
		return this.espacios.findAllWithMeta();
	}

	@Post()
	create(@Body() dto: CreateEspacioDto) {
		return this.espacios.create(dto);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() dto: UpdateEspacioDto) {
		return this.espacios.update(id, dto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.espacios.remove(id);
	}
}
