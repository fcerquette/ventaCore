<template>
	<span class="inline-flex items-center" :style="{ gap }">
		<svg :width="size" :height="size" viewBox="0 0 48 48" role="img" :aria-label="label" class="shrink-0">
			<path d="M11 14 L23 31" :stroke="stroke" stroke-width="6" stroke-linecap="round" fill="none" />
			<path d="M37 12 L25 31" :stroke="stroke" stroke-width="6" stroke-linecap="round" fill="none" />
			<circle cx="24" cy="32" r="6.2" :stroke="stroke" stroke-width="3" style="fill: var(--logo-core)" />
			<defs>
				<linearGradient :id="gradId" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" style="stop-color: var(--logo-grad-a)" />
					<stop offset="1" style="stop-color: var(--logo-grad-b)" />
				</linearGradient>
			</defs>
		</svg>
		<span
			v-if="wordmark"
			class="font-extrabold leading-none tracking-tight whitespace-nowrap"
			:style="{ fontSize: wordmarkSize }"
		>
			<span class="text-surface-900 dark:text-surface-0">Venta</span><span class="vc-core">Core</span>
		</span>
	</span>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';

const props = withDefaults(
	defineProps<{
		/** Alto/ancho del isotipo, en px. */
		size?: number;
		/** Mostrar el nombre "VentaCore" junto al isotipo. */
		wordmark?: boolean;
		/** Texto accesible del logo. */
		label?: string;
	}>(),
	{ size: 30, wordmark: true, label: 'VentaCore' },
);

// Id único por instancia: evita que varios logos en la misma página compartan
// el mismo gradiente (los ids duplicados hacen que todos usen el primero).
const gradId = `vc-grad-${useId()}`;
const stroke = computed(() => `url(#${gradId})`);
const gap = computed(() => `${Math.round(props.size * 0.34)}px`);
const wordmarkSize = computed(() => `${Math.round(props.size * 0.64)}px`);
</script>

<style scoped>
/* "Core" con el gradiente de marca (las variables se definen en style.css y
   cambian solas en modo oscuro). */
.vc-core {
	background: linear-gradient(135deg, var(--logo-grad-a), var(--logo-grad-b));
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
}
</style>
