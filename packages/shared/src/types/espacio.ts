/**
 * Un "espacio" es el negocio de un CM (admin). El superadmin los crea y
 * administra; cada espacio tiene un único admin y su propia vitrina pública
 * en /s/{slug}.
 */
export interface Espacio {
	id: string;
	nombre: string;
	/** Identificador (subdominio en dev: {slug}.localhost) */
	slug: string;
	/** Dominio propio del negocio (ej: mitienda.com), o null */
	domain: string | null;
	descripcion: string | null;
	logoUrl: string | null;
	active: boolean;
	// Contacto y página "Sobre Nosotros" (editable por el admin)
	whatsapp: string | null;
	instagramUrl: string | null;
	aboutHeadline: string | null;
	aboutText: string | null;
	aboutImageUrl: string | null;
	createdAt: string;
	updatedAt: string;
	/** Solo en el panel superadmin: email del admin y cantidad de rubros. */
	adminEmail?: string | null;
	rubroCount?: number;
}
