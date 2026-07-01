import type { RouteRecordRaw } from 'vue-router';
import LoginForm from '@/modules/auth/components/LoginForm.vue';
import AreaLayout from '@/modules/auth/components/AreaLayout.vue';

const appRoutes: RouteRecordRaw[] = [
	{
		path: '/app/login',
		name: 'app-login',
		component: LoginForm,
		props: { area: 'app' },
		meta: { guestOnly: true, area: 'app' },
	},
	{
		path: '/app',
		component: AreaLayout,
		props: { area: 'app' },
		meta: { requiresAuth: true, area: 'app' },
		children: [
			{
				path: '',
				name: 'app-home',
				component: () => import('./views/Home.vue'),
			},
		],
	},
];

export default appRoutes;
