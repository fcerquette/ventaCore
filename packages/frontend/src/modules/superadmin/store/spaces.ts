import { defineStore } from 'pinia';
import type { Espacio } from '@base-template/shared';
import { api } from '@/shared/services/api';

interface SpacesState {
	espacios: Espacio[];
}

export interface CreateEspacioInput {
	nombre: string;
	descripcion?: string;
	logoUrl?: string;
	domain?: string;
	adminEmail: string;
	adminPassword: string;
}

export type UpdateEspacioInput = Partial<Pick<Espacio, 'nombre' | 'descripcion' | 'logoUrl' | 'domain' | 'active'>>;

export const useSpacesStore = defineStore('spaces', {
	state: (): SpacesState => ({
		espacios: [],
	}),

	getters: {
		activos: (state): number => state.espacios.filter(e => e.active).length,
	},

	actions: {
		async fetchEspacios(): Promise<void> {
			const { data } = await api.get<Espacio[]>('/espacios');
			this.espacios = data;
		},

		async createEspacio(input: CreateEspacioInput): Promise<Espacio> {
			const { data } = await api.post<Espacio>('/espacios', input);
			this.espacios.unshift(data);
			return data;
		},

		async updateEspacio(id: string, input: UpdateEspacioInput): Promise<Espacio> {
			const { data } = await api.patch<Espacio>(`/espacios/${id}`, input);
			const i = this.espacios.findIndex(e => e.id === id);
			if (i !== -1) this.espacios[i] = data;
			return data;
		},

		async deleteEspacio(id: string): Promise<void> {
			await api.delete(`/espacios/${id}`);
			this.espacios = this.espacios.filter(e => e.id !== id);
		},
	},
});
