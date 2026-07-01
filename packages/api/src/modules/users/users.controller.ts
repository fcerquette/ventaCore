import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@base-template/shared';
import { FirebaseAuthGuard } from '../../common/auth/firebase-auth.guard';
import { RolesGuard } from '../../common/auth/roles.guard';
import { Roles } from '../../common/auth/roles.decorator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
	constructor(private readonly users: UsersService) {}

	@Get()
	@Roles(Role.SUPERADMIN, Role.ADMIN)
	findAll() {
		return this.users.findAll();
	}

	@Get(':id')
	@Roles(Role.SUPERADMIN, Role.ADMIN)
	findOne(@Param('id') id: string) {
		return this.users.findOne(id);
	}

	@Post()
	@Roles(Role.SUPERADMIN)
	create(@Body() dto: CreateUserDto) {
		return this.users.create(dto);
	}

	@Patch(':id')
	@Roles(Role.SUPERADMIN)
	update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
		return this.users.update(id, dto);
	}

	@Delete(':id')
	@Roles(Role.SUPERADMIN)
	remove(@Param('id') id: string) {
		return this.users.remove(id);
	}
}
