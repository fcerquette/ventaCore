import { ref } from 'vue';

/**
 * Manejo del tema claro/oscuro.
 *
 * - Default: sigue la preferencia del sistema (`prefers-color-scheme`).
 * - Apenas el usuario toca el toggle, su elección queda fija y persiste en
 *   `localStorage` — es local a este dispositivo/navegador, no se comparte con
 *   otros usuarios ni con otros roles.
 * - El modo oscuro se activa agregando la clase `.p-dark` al `<html>`, que es
 *   el selector configurado tanto en PrimeVue como en Tailwind.
 */

const STORAGE_KEY = 'theme';
const DARK_CLASS = 'p-dark';
type ThemeChoice = 'light' | 'dark';

/** `true` = modo oscuro. Reactivo, para los botones de toggle. */
export const isDark = ref(false);

function systemPrefersDark(): boolean {
	return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/** Preferencia guardada, o `null` si el usuario nunca eligió (→ auto por sistema). */
function storedChoice(): ThemeChoice | null {
	try {
		const v = localStorage.getItem(STORAGE_KEY);
		return v === 'light' || v === 'dark' ? v : null;
	} catch {
		return null;
	}
}

function apply(dark: boolean): void {
	isDark.value = dark;
	document.documentElement.classList.toggle(DARK_CLASS, dark);
}

/** Inicializa el tema al arrancar la app. Llamar antes de montar. */
export function initTheme(): void {
	const choice = storedChoice();
	apply(choice ? choice === 'dark' : systemPrefersDark());

	// Mientras no haya elección manual, seguimos los cambios del sistema en vivo.
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
		if (!storedChoice()) apply(e.matches);
	});
}

/** Alterna claro/oscuro y persiste la elección para este dispositivo. */
export function toggleTheme(): void {
	const next: ThemeChoice = isDark.value ? 'light' : 'dark';
	try {
		localStorage.setItem(STORAGE_KEY, next);
	} catch {
		/* localStorage no disponible (modo privado, etc.): igual aplicamos en memoria. */
	}
	apply(next === 'dark');
}
