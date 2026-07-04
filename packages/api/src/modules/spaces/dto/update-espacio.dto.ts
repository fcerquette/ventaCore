import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateEspacioDto {
	@ApiProperty({ required: false })
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
	logoUrl?: string;

	@ApiProperty({ required: false, example: 'mitienda.com' })
	@IsOptional()
	@IsString()
	domain?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsBoolean()
	active?: boolean;
}
