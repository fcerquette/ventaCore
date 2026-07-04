import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { Role } from '@base-template/shared';

export class CreateUserDto {
	@ApiProperty({ example: 'user@example.com' })
	@IsEmail()
	email!: string;

	@ApiProperty({ example: 'secret123', minLength: 6 })
	@IsString()
	@MinLength(6)
	password!: string;

	@ApiProperty({ required: false, example: 'Juan Pérez' })
	@IsOptional()
	@IsString()
	displayName?: string;

	@ApiProperty({ enum: Role, example: Role.USER })
	@IsEnum(Role)
	role!: Role;

	@ApiProperty({ required: false, default: true })
	@IsOptional()
	@IsBoolean()
	active?: boolean;

	@ApiProperty({ required: false, description: 'Espacio del admin/CM' })
	@IsOptional()
	@IsUUID()
	espacioId?: string;
}
