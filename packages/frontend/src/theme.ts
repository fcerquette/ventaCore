import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

/**
 * Preset de tema PrimeVue.
 *
 * - `primary`: paleta violeta de marca (igual en claro y oscuro; PrimeVue la
 *   aclara sola para el modo oscuro).
 * - `colorScheme.dark.surface`: rampa "navy" de la paleta de Stitch
 *   (Advantage Core · Dark Edition). Solo afecta al modo oscuro; el modo claro
 *   queda con los surfaces neutros por defecto de Aura.
 *
 * Los tokens `surface-*` alimentan tanto a los componentes de PrimeVue como a
 * las clases de Tailwind (`bg-surface-950`, `border-surface-700`, etc.) vía
 * tailwindcss-primeui, así que con ajustarlos acá se repinta toda la app.
 */
export const AppPreset = definePreset(Aura, {
	semantic: {
		primary: {
			50: '{violet.50}',
			100: '{violet.100}',
			200: '{violet.200}',
			300: '{violet.300}',
			400: '{violet.400}',
			500: '{violet.500}',
			600: '{violet.600}',
			700: '{violet.700}',
			800: '{violet.800}',
			900: '{violet.900}',
			950: '{violet.950}',
		},
		colorScheme: {
			dark: {
				// La app usa índices BAJOS (0–500) para texto e índices ALTOS
				// (700–950) para fondos. Por eso el extremo de texto se aclara
				// (colores on-surface de Stitch) y el de fondo queda navy
				// (surface-container de Stitch). Anclas exactas de Stitch:
				// 100=on-surface, 200=on-surface-variant, 400=outline,
				// 700=bordes, 800=hover, 900=cards/nav, 950=fondo.
				surface: {
					0: '#ffffff',
					50: '#eaf1fb',
					100: '#d4e4fa', // on-surface (texto principal)
					200: '#cac4d4', // on-surface-variant (texto secundario)
					300: '#bcc2cd', // texto secundario un tono más tenue
					400: '#a2acbb', // descripciones / texto atenuado (legible)
					500: '#8b96a5', // descripciones de cards / texto tenue (legible en navy)
					600: '#55606f',
					700: '#273647', // bordes (surface-container-highest)
					800: '#1c2b3c', // hover (surface-container-high)
					900: '#122131', // cards / nav (surface-container)
					950: '#051424', // fondo (background)
				},
			},
		},
	},
});

export const themeConfig = {
	preset: AppPreset,
	options: {
		darkModeSelector: '.p-dark',
	},
};
