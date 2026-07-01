import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '@base-template/shared';

export class UpdateUserDto {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	displayName?: string;

	@ApiProperty({ required: false, enum: Role })
	@IsOptional()
	@IsEnum(Role)
	role?: Role;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsBoolean()
	active?: boolean;
}
