import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoEntity } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { RubrosService } from './rubros.service';

@Injectable()
export class ProductosService {
	constructor(
		@InjectRepository(ProductoEntity)
		private readonly repo: Repository<ProductoEntity>,
		private readonly rubros: RubrosService,
	) {}

	/** Lista los productos de un rubro, validando que el rubro sea del espacio. */
	async findByRubro(rubroId: string, espacioId: string): Promise<ProductoEntity[]> {
		await this.rubros.findOne(rubroId, espacioId);
		return this.repo.find({ where: { rubroId }, order: { createdAt: 'DESC' } });
	}

	private async findOwned(id: string, rubroId: string, espacioId: string): Promise<ProductoEntity> {
		await this.rubros.findOne(rubroId, espacioId);
		const producto = await this.repo.findOne({ where: { id, rubroId } });
		if (!producto) throw new NotFoundException('Producto no encontrado');
		return producto;
	}

	async create(rubroId: string, espacioId: string, dto: CreateProductoDto): Promise<ProductoEntity> {
		await this.rubros.findOne(rubroId, espacioId);
		const entity = this.repo.create({ ...dto, rubroId });
		return this.repo.save(entity);
	}

	async update(id: string, rubroId: string, espacioId: string, dto: UpdateProductoDto): Promise<ProductoEntity> {
		const producto = await this.findOwned(id, rubroId, espacioId);
		Object.assign(producto, dto);
		return this.repo.save(producto);
	}

	async remove(id: string, rubroId: string, espacioId: string): Promise<void> {
		const producto = await this.findOwned(id, rubroId, espacioId);
		await this.repo.remove(producto);
	}

	/** Público: productos de un rubro activo (404 si el rubro no es público). */
	async findPublicByRubro(rubroId: string): Promise<ProductoEntity[]> {
		await this.rubros.findPublicOne(rubroId);
		return this.repo.find({ where: { rubroId }, order: { createdAt: 'DESC' } });
	}
}
