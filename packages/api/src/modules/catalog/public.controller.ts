import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { EspaciosService } from '../spaces/espacios.service';
import { RubrosService } from './rubros.service';
import { ProductosService } from './productos.service';

/**
 * Endpoints públicos (sin autenticación) de la vitrina de cada negocio. El negocio
 * se resuelve por el hostname del navegador (dominio propio o subdominio en dev).
 */
@ApiTags('public')
@Controller('public')
export class PublicController {
	constructor(
		private readonly espacios: EspaciosService,
		private readonly rubros: RubrosService,
		private readonly productos: ProductosService,
	) {}

	/** Vitrina del negocio del dominio actual: sus datos + rubros activos. */
	@Get('site')
	@ApiQuery({ name: 'host', example: 'campo-ruta.localhost' })
	async site(@Query('host') host: string) {
		const espacio = await this.espacios.resolveByHost(host);
		const rubros = await this.rubros.findPublicByEspacio(espacio.id);
		return { espacio, rubros };
	}

	/** Un rubro activo (para el encabezado del detalle). */
	@Get('rubros/:id')
	rubro(@Param('id') id: string) {
		return this.rubros.findPublicOne(id);
	}

	/** Productos de un rubro activo. */
	@Get('rubros/:id/productos')
	productosDeRubro(@Param('id') id: string) {
		return this.productos.findPublicByRubro(id);
	}
}
