import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '@base-template/shared';

@Entity('users')
export class UserEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ unique: true })
	uid!: string;

	@Column({ unique: true })
	email!: string;

	@Column({ type: 'varchar', nullable: true })
	displayName!: string | null;

	@Column({ type: 'enum', enum: Role, default: Role.USER })
	role!: Role;

	/** Espacio (negocio) del admin/CM. null para superadmin y usuarios públicos. */
	@Column({ type: 'uuid', nullable: true })
	espacioId!: string | null;

	@Column({ default: true })
	active!: boolean;

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;
}
