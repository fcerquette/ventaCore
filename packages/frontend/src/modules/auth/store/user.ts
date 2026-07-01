import { defineStore } from 'pinia';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import type { UserProfile, Role } from '@base-template/shared';
import { auth, authReady } from '@/shared/providers/firebase';
import { api } from '@/shared/services/api';

interface UserState {
	profile: UserProfile | null;
	ready: boolean;
}

export const useUserStore = defineStore('user', {
	state: (): UserState => ({
		profile: null,
		ready: false,
	}),

	getters: {
		isAuthenticated: state => !!state.profile,
		role: (state): Role | null => state.profile?.role ?? null,
	},

	actions: {
		/**
		 * Restaura la sesión: espera a Firebase y, si hay usuario,
		 * trae el perfil (con rol) desde el API. Cachea el resultado.
		 */
		async currentUser(): Promise<UserProfile | null> {
			if (this.ready) return this.profile;

			const fbUser = await authReady;
			if (!fbUser) {
				this.ready = true;
				return null;
			}

			await this.fetchProfile();
			this.ready = true;
			return this.profile;
		},

		async fetchProfile(): Promise<void> {
			try {
				const { data } = await api.get<{ user: UserProfile }>('/auth/me');
				this.profile = data.user;
			} catch {
				this.profile = null;
			}
		},

		async login(email: string, password: string): Promise<UserProfile> {
			await signInWithEmailAndPassword(auth, email, password);
			await this.fetchProfile();
			this.ready = true;
			if (!this.profile) {
				await this.logout();
				throw new Error('No se pudo cargar el perfil del usuario');
			}
			return this.profile;
		},

		async logout(): Promise<void> {
			await signOut(auth);
			this.profile = null;
			this.ready = true;
		},
	},
});
