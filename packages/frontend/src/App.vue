<template>
	<router-view />
	<Toast />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useDocumentTitle } from '@/composables/useDocumentTitle';

export default defineComponent({
	name: 'App',
	setup() {
		useDocumentTitle();
	},
});
</script>
