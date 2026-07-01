<template>
	<div class="mx-auto max-w-4xl">
		<h2 class="mb-2 text-2xl font-semibold text-surface-900 dark:text-surface-0">Aplicación</h2>
		<p class="text-surface-600 dark:text-surface-300">
			{{ $t('common.welcome') }}. Esta es el área de la aplicación para usuarios finales.
		</p>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'AppHome',
});
</script>
