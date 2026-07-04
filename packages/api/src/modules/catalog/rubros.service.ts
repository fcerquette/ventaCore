import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RubroStatus } from '@base-template/shared';
import { RubroEntity } from './entities/rubro.entity';
import { CreateRubroDto } from './dto/create-rubro.dto';
import { UpdateRubroDto } from './dto/update-rubro.dto';

@Injectable()
export class RubrosService {
	constructor(
		@InjectRepository(RubroEntity)
		private readonly repo: Repository<RubroEntity>,
	) {}

	findByEspacio(espacioId: string): Promise<RubroEntity[]> {
		return this.repo.find({ where: { espacioId }, order: { createdAt: 'DESC' } });
	}

	/** Busca un rubro validando que pertenezca al espacio dado. */
	async findOne(id: string, espacioId: string): Promise<RubroEntity> {
		const rubro = await this.repo.findOne({ where: { id, espacioId } });
		if (!rubro) throw new NotFoundException('Rubro no encontrado');
		return rubro;
	}

	create(espacioId: string, dto: CreateRubroDto): Promise<RubroEntity> {
		const entity = this.repo.create({ ...dto, espacioId });
		return this.repo.save(entity);
	}

	async update(id: string, espacioId: string, dto: UpdateRubroDto): Promise<RubroEntity> {
		const rubro = await this.findOne(id, espacioId);
		Object.assign(rubro, dto);
		return this.repo.save(rubro);
	}

	async remove(id: string, espacioId: string): Promise<void> {
		const rubro = await this.findOne(id, espacioId);
		await this.repo.remove(rubro);
	}

	// ── Público: solo rubros activos de un espacio ──

	/** Rubros activos de un espacio, con el conteo de productos. */
	findPublicByEspacio(espacioId: string): Promise<RubroEntity[]> {
		return this.repo
			.createQueryBuilder('rubro')
			.loadRelationCountAndMap('rubro.productCount', 'rubro.productos')
			.where('rubro.espacioId = :espacioId', { espacioId })
			.andWhere('rubro.status = :status', { status: RubroStatus.ACTIVE })
			.orderBy('rubro.createdAt', 'DESC')
			.getMany();
	}

	/** Un rubro activo (404 si no existe o está en borrador). */
	async findPublicOne(id: string): Promise<RubroEntity> {
		const rubro = await this.repo.findOne({ where: { id, status: RubroStatus.ACTIVE } });
		if (!rubro) throw new NotFoundException('Rubro no encontrado');
		return rubro;
	}
}
