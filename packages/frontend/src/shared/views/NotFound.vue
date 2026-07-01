<template>
	<div class="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-50 dark:bg-surface-950">
		<h1 class="text-6xl font-bold text-primary">404</h1>
		<p class="text-surface-600 dark:text-surface-300">{{ $t('common.notFound') }}</p>
		<Button :label="$t('areas.app')" @click="$router.push('/app')" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'NotFound',
});
</script>
