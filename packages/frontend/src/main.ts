import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persistedstate';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

import App from './App.vue';
import router from './router';
import { i18n } from './i18n';
import { themeConfig } from './theme';
import { initTheme } from './composables/useTheme';
import './style.css';

initTheme();

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPersist);

app.use(pinia);
app.use(router);
app.use(i18n);
app.use(PrimeVue, { theme: themeConfig });
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');
