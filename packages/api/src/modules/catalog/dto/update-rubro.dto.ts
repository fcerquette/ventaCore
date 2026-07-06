import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { RubroStatus } from '@base-template/shared';

export class UpdateRubroDto {
	@ApiProperty({ required: false, example: 'Bienes Raíces' })
	@IsOptional()
	@IsString()
	@MinLength(2)
	nombre?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	descripcion?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	imageUrl?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	logoUrl?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	instagramUrl?: string;

	@ApiProperty({ enum: RubroStatus, required: false })
	@IsOptional()
	@IsEnum(RubroStatus)
	status?: RubroStatus;
}
