<template>
	<div class="min-h-screen bg-surface-50 dark:bg-surface-950">
		<!-- Topbar -->
		<header
			class="fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-between border-b border-surface-200/60 bg-surface-0/70 px-6 backdrop-blur-xl dark:border-surface-700/60 dark:bg-surface-900/70"
		>
			<div class="flex items-center gap-3">
				<span class="text-xl font-extrabold text-primary">{{ $t('app.brand') }}</span>
				<span class="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
					{{ $t('areas.superadmin') }}
				</span>
			</div>

			<div class="flex items-center gap-3">
				<Button
					:label="$t('admin.viewSite')"
					icon="pi pi-external-link"
					severity="secondary"
					size="small"
					outlined
					@click="$router.push('/')"
				/>
				<span class="hidden text-sm font-semibold text-surface-700 dark:text-surface-200 sm:inline">
					{{ email }}
				</span>
				<Button
					:label="$t('common.logout')"
					icon="pi pi-sign-out"
					severity="secondary"
					size="small"
					text
					@click="onLogout"
				/>
			</div>
		</header>

		<!-- Sidebar -->
		<aside
			class="fixed top-16 left-0 z-40 flex h-[calc(100vh-64px)] w-64 flex-col border-r border-surface-200/60 bg-surface-0/60 p-4 backdrop-blur-2xl dark:border-surface-700/60 dark:bg-surface-900/60"
		>
			<div class="mb-8 px-3">
				<h2 class="text-lg font-black text-primary">{{ $t('superadmin.panelTitle') }}</h2>
				<p class="text-xs text-surface-500">{{ $t('superadmin.panelSubtitle') }}</p>
			</div>

			<nav class="flex flex-1 flex-col gap-1">
				<router-link
					v-for="item in navItems"
					:key="item.key"
					:to="item.to"
					:class="[
						'flex items-center gap-3 rounded-xl p-3 text-sm font-semibold transition-all',
						item.disabled
							? 'cursor-not-allowed text-surface-400'
							: 'bg-primary/10 text-primary shadow-sm',
					]"
					@click="item.disabled && $event.preventDefault()"
				>
					<i :class="item.icon" />
					<span>{{ $t(item.label) }}</span>
					<span v-if="item.disabled" class="ml-auto text-[10px] uppercase text-surface-400">
						{{ $t('admin.soon') }}
					</span>
				</router-link>
			</nav>
		</aside>

		<!-- Contenido -->
		<main class="mt-16 ml-64 min-h-[calc(100vh-64px)] p-6">
			<router-view />
		</main>

		<Toast />
		<ConfirmDialog />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useUserStore } from '@/modules/auth/store/user';

export default defineComponent({
	name: 'SuperadminLayout',
	data() {
		return {
			navItems: [
				{ key: 'espacios', label: 'superadmin.nav.espacios', icon: 'pi pi-building', to: '/superadmin' },
				{ key: 'usuarios', label: 'superadmin.nav.usuarios', icon: 'pi pi-users', to: '/superadmin', disabled: true },
				{ key: 'config', label: 'superadmin.nav.config', icon: 'pi pi-cog', to: '/superadmin', disabled: true },
			],
		};
	},
	computed: {
		email(): string {
			return useUserStore().profile?.email ?? '';
		},
	},
	methods: {
		async onLogout() {
			await useUserStore().logout();
			this.$router.replace('/');
		},
	},
});
</script>
