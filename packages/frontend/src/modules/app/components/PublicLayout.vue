<template>
	<div class="min-h-screen bg-surface-50 dark:bg-surface-950">
		<header
			class="sticky top-0 z-50 border-b border-surface-200/70 bg-surface-0/80 shadow-sm backdrop-blur-xl dark:border-surface-700/70 dark:bg-surface-900/80"
		>
			<div class="mx-auto grid h-16 max-w-7xl grid-cols-2 items-center px-6 md:grid-cols-3">
				<!-- Marca -->
				<router-link to="/" class="flex items-center gap-2.5 justify-self-start">
					<div v-if="espacio?.logoUrl" class="h-9 w-9 overflow-hidden rounded-lg">
						<img :src="espacio.logoUrl" class="h-full w-full object-cover" :alt="espacio.nombre" />
					</div>
					<span class="text-lg font-extrabold tracking-tight text-primary">
						{{ espacio?.nombre || $t('app.brand') }}
					</span>
				</router-link>

				<!-- Navegación centrada -->
				<nav class="hidden items-center justify-center gap-8 md:flex">
					<router-link
						to="/"
						class="border-b-2 border-transparent pb-1 text-sm font-medium text-surface-600 transition-colors hover:text-primary dark:text-surface-300"
						exact-active-class="!border-primary !text-primary"
					>{{ $t('public.nav.home') }}</router-link>
					<router-link
						to="/nosotros"
						class="border-b-2 border-transparent pb-1 text-sm font-medium text-surface-600 transition-colors hover:text-primary dark:text-surface-300"
						active-class="!border-primary !text-primary"
					>{{ $t('public.about.nav') }}</router-link>
				</nav>

				<!-- Acciones -->
				<div class="flex items-center gap-3 justify-self-end">
					<template v-if="isAuthenticated">
						<Button
							:label="$t('nav.goToPanel')"
							rounded
							size="small"
							class="primary-gradient border-0 px-5 font-semibold text-white shadow-md"
							@click="onGoToPanel"
						/>
						<Button :label="$t('common.logout')" severity="secondary" size="small" text @click="onLogout" />
					</template>
					<Button
						v-else
						:label="$t('common.login')"
						rounded
						size="small"
						class="primary-gradient border-0 px-6 font-semibold text-white shadow-md"
						@click="onSignIn"
					/>
				</div>
			</div>
		</header>

		<main class="mx-auto max-w-7xl p-6">
			<router-view v-if="ready" />
			<div v-else class="py-24 text-center text-surface-400">
				<i class="pi pi-spin pi-spinner text-3xl" />
			</div>
		</main>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { areaForRole, type Espacio } from '@base-template/shared';
import { useUserStore } from '@/modules/auth/store/user';
import { useCatalogStore } from '@/modules/admin/store/catalog';

export default defineComponent({
	name: 'PublicLayout',
	data() {
		return {
			catalog: useCatalogStore(),
			ready: false,
		};
	},
	computed: {
		isAuthenticated(): boolean {
			return useUserStore().isAuthenticated;
		},
		espacio(): Espacio | null {
			return this.catalog.currentEspacio;
		},
	},
	async created() {
		// Sesión no bloqueante (para decidir "Iniciar sesión" vs "Ir al panel").
		void useUserStore().currentUser();
		// Resuelve el negocio por el dominio; si no hay ninguno, al login.
		const ok = await this.catalog.resolveSite();
		if (!ok) {
			this.$router.replace('/login');
			return;
		}
		this.ready = true;
	},
	methods: {
		onSignIn() {
			this.$router.push('/login');
		},
		onGoToPanel() {
			const role = useUserStore().role;
			if (role) this.$router.push(areaForRole(role).homePath);
		},
		async onLogout() {
			await useUserStore().logout();
		},
	},
});
</script>
