import type { RouteRecordRaw } from 'vue-router';
import LoginForm from '@/modules/auth/components/LoginForm.vue';
import AreaLayout from '@/modules/auth/components/AreaLayout.vue';

const adminRoutes: RouteRecordRaw[] = [
	{
		path: '/admin/login',
		name: 'admin-login',
		component: LoginForm,
		props: { area: 'admin' },
		meta: { guestOnly: true, area: 'admin' },
	},
	{
		path: '/admin',
		component: AreaLayout,
		props: { area: 'admin' },
		meta: { requiresAuth: true, area: 'admin' },
		children: [
			{
				path: '',
				name: 'admin-home',
				component: () => import('./views/Dashboard.vue'),
			},
		],
	},
];

export default adminRoutes;
