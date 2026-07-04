<template>
	<div class="min-h-screen bg-surface-50 dark:bg-surface-950">
		<header
			class="flex items-center justify-between border-b border-surface-200 bg-white px-6 py-3 dark:border-surface-700 dark:bg-surface-900"
		>
			<div class="flex items-center gap-3">
				<div v-if="espacio?.logoUrl" class="h-8 w-8 overflow-hidden rounded-lg">
					<img :src="espacio.logoUrl" class="h-full w-full object-cover" :alt="espacio.nombre" />
				</div>
				<span class="text-base font-semibold text-surface-900 dark:text-surface-0">
					{{ espacio?.nombre || $t('app.brand') }}
				</span>
			</div>
			<div class="flex items-center gap-3">
				<template v-if="isAuthenticated">
					<Button :label="$t('nav.goToPanel')" size="small" @click="onGoToPanel" />
					<Button :label="$t('common.logout')" severity="secondary" size="small" text @click="onLogout" />
				</template>
				<Button v-else :label="$t('common.login')" size="small" @click="onSignIn" />
			</div>
		</header>

		<main class="p-6">
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
