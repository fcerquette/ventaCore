import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { RubroStatus } from '@base-template/shared';

export class CreateRubroDto {
	@ApiProperty({ example: 'Bienes Raíces' })
	@IsString()
	@MinLength(2)
	nombre!: string;

	@ApiProperty({ required: false, example: 'Propiedades de lujo y desarrollos urbanos.' })
	@IsOptional()
	@IsString()
	descripcion?: string;

	@ApiProperty({ required: false, example: 'https://.../portada.jpg' })
	@IsOptional()
	@IsString()
	imageUrl?: string;

	@ApiProperty({ required: false, example: 'https://.../logo.png' })
	@IsOptional()
	@IsString()
	logoUrl?: string;

	@ApiProperty({ required: false, example: 'https://instagram.com/el.negocio' })
	@IsOptional()
	@IsString()
	instagramUrl?: string;

	@ApiProperty({ enum: RubroStatus, required: false, default: RubroStatus.DRAFT })
	@IsOptional()
	@IsEnum(RubroStatus)
	status?: RubroStatus;
}
