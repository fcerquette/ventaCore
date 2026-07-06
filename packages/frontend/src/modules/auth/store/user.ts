import { defineStore } from 'pinia';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import type { UserProfile, Role } from '@base-template/shared';
import { auth, authReady } from '@/shared/providers/firebase';
import { api } from '@/shared/services/api';

interface UserState {
	profile: UserProfile | null;
	ready: boolean;
	/** El negocio del usuario está suspendido: no puede entrar al panel. */
	suspended: boolean;
}

/** Error de login por negocio suspendido (lo distingue el formulario). */
export class SuspendedError extends Error {
	code = 'ESPACIO_SUSPENDED' as const;
}

export const useUserStore = defineStore('user', {
	state: (): UserState => ({
		profile: null,
		ready: false,
		suspended: false,
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
			// Sesión persistida de un negocio suspendido: cerramos Firebase para
			// quedar deslogueados; el flag `suspended` lo lee el login.
			if (this.suspended) await signOut(auth).catch(() => undefined);
			return this.profile;
		},

		async fetchProfile(): Promise<void> {
			try {
				const { data } = await api.get<{ user: UserProfile }>('/auth/me');
				this.profile = data.user;
				this.suspended = false;
			} catch (e: unknown) {
				this.profile = null;
				const res = (e as { response?: { status?: number; data?: { code?: string } } })?.response;
				this.suspended = res?.status === 403 && res?.data?.code === 'ESPACIO_SUSPENDED';
			}
		},

		async login(email: string, password: string): Promise<UserProfile> {
			await signInWithEmailAndPassword(auth, email, password);
			await this.fetchProfile();
			this.ready = true;

			// Negocio suspendido: no lo dejamos entrar y avisamos con un error propio.
			if (this.suspended) {
				await signOut(auth).catch(() => undefined);
				throw new SuspendedError('El negocio está suspendido');
			}
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
			this.suspended = false;
		},
	},
});
