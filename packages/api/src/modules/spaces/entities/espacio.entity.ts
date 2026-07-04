import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('espacios')
export class EspacioEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column()
	nombre!: string;

	/** Slug único (identificador; subdominio en dev: {slug}.localhost). */
	@Index({ unique: true })
	@Column()
	slug!: string;

	/** Dominio propio del negocio (ej: mitienda.com). Resuelve la vitrina por hostname. */
	@Index({ unique: true })
	@Column({ type: 'varchar', nullable: true })
	domain!: string | null;

	@Column({ type: 'text', nullable: true })
	descripcion!: string | null;

	@Column({ type: 'varchar', nullable: true })
	logoUrl!: string | null;

	@Column({ default: true })
	active!: boolean;

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;
}
